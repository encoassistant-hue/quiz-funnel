do $$
declare
  event_type_udt text;
  environment_udt text;
  constraint_name text;
begin
  select udt_name
  into event_type_udt
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'quiz_events'
    and column_name = 'event_type';

  if event_type_udt is null then
    raise exception 'public.quiz_events.event_type was not found';
  end if;

  alter table public.quiz_events
    add column if not exists environment text;

  update public.quiz_events
  set environment = 'prod'
  where environment is null;

  alter table public.quiz_events
    alter column environment set default 'prod';

  alter table public.quiz_events
    alter column environment set not null;

  select udt_name
  into environment_udt
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'quiz_events'
    and column_name = 'environment';

  if exists (
    select 1
    from pg_type
    where typname = event_type_udt
      and typtype = 'e'
  ) then
    execute format('alter type %I add value if not exists ''cta_click''', event_type_udt);
  else
    for constraint_name in
      select con.conname
      from pg_constraint con
      join pg_class rel on rel.oid = con.conrelid
      join pg_namespace nsp on nsp.oid = rel.relnamespace
      where nsp.nspname = 'public'
        and rel.relname = 'quiz_events'
        and con.contype = 'c'
        and pg_get_constraintdef(con.oid) like '%event_type%'
    loop
      execute format('alter table public.quiz_events drop constraint %I', constraint_name);
    end loop;

    alter table public.quiz_events
      add constraint quiz_events_event_type_check
      check (event_type in ('step_view', 'answer', 'cta_click'));
  end if;

  if exists (
    select 1
    from pg_type
    where typname = environment_udt
      and typtype = 'e'
  ) then
    execute format('alter type %I add value if not exists ''dev''', environment_udt);
    execute format('alter type %I add value if not exists ''preview''', environment_udt);
    execute format('alter type %I add value if not exists ''prod''', environment_udt);
  else
    for constraint_name in
      select con.conname
      from pg_constraint con
      join pg_class rel on rel.oid = con.conrelid
      join pg_namespace nsp on nsp.oid = rel.relnamespace
      where nsp.nspname = 'public'
        and rel.relname = 'quiz_events'
        and con.contype = 'c'
        and pg_get_constraintdef(con.oid) like '%environment%'
    loop
      execute format('alter table public.quiz_events drop constraint %I', constraint_name);
    end loop;

    alter table public.quiz_events
      add constraint quiz_events_environment_check
      check (environment in ('dev', 'preview', 'prod'));
  end if;
end
$$;

create or replace function public.analytics_overview(
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_version text default null,
  p_environment text default null
)
returns table(
  total_events bigint,
  total_sessions bigint,
  first_event_at timestamptz,
  last_event_at timestamptz
)
language sql
stable
as $$
  select
    count(*)::bigint as total_events,
    count(distinct session_id)::bigint as total_sessions,
    min(created_at) as first_event_at,
    max(created_at) as last_event_at
  from public.quiz_events
  where (p_from is null or created_at >= p_from)
    and (p_to is null or created_at < p_to)
    and (p_version is null or version = p_version)
    and (p_environment is null or environment = p_environment);
$$;

create or replace function public.analytics_funnel_summary(
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_version text default null,
  p_environment text default null
)
returns table(
  step_position integer,
  step_id text,
  reached bigint,
  continued bigint,
  dropped bigint,
  dropoff_rate numeric
)
language sql
stable
as $$
  with step_order(position, step_id) as (
    values
      (1, 'landing'),
      (2, 'q1'),
      (3, 'q2'),
      (4, 'q3'),
      (5, 'q4'),
      (6, 'q5'),
      (7, 'results1'),
      (8, 'q6'),
      (9, 'education'),
      (10, 'q7'),
      (11, 'q8'),
      (12, 'results2')
  ),
  filtered_steps as (
    select distinct session_id, step_id
    from public.quiz_events
    where event_type = 'step_view'
      and (p_from is null or created_at >= p_from)
      and (p_to is null or created_at < p_to)
      and (p_version is null or version = p_version)
      and (p_environment is null or environment = p_environment)
  ),
  filtered_cta_clicks as (
    select distinct session_id
    from public.quiz_events
    where event_type = 'cta_click'
      and step_id = 'results2'
      and (p_from is null or created_at >= p_from)
      and (p_to is null or created_at < p_to)
      and (p_version is null or version = p_version)
      and (p_environment is null or environment = p_environment)
  ),
  filtered_results2_reached as (
    select session_id
    from filtered_steps
    where step_id = 'results2'

    union

    select session_id
    from filtered_cta_clicks
  )
  select
    current.position as step_position,
    current.step_id,
    case
      when current.step_id = 'results2' then count(distinct results2_reached.session_id)::bigint
      else count(distinct current_sessions.session_id)::bigint
    end as reached,
    case
      when current.step_id = 'results2' then count(distinct cta_sessions.session_id)::bigint
      else count(distinct next_sessions.session_id)::bigint
    end as continued,
    case
      when current.step_id = 'results2' then (count(distinct results2_reached.session_id) - count(distinct cta_sessions.session_id))::bigint
      else (count(distinct current_sessions.session_id) - count(distinct next_sessions.session_id))::bigint
    end as dropped,
    case
      when current.step_id = 'results2' and count(distinct results2_reached.session_id) = 0 then 0
      when current.step_id <> 'results2' and count(distinct current_sessions.session_id) = 0 then 0
      else round(
        (
          case
            when current.step_id = 'results2' then (count(distinct results2_reached.session_id) - count(distinct cta_sessions.session_id))::numeric
            else (count(distinct current_sessions.session_id) - count(distinct next_sessions.session_id))::numeric
          end
          /
          case
            when current.step_id = 'results2' then count(distinct results2_reached.session_id)
            else count(distinct current_sessions.session_id)
          end
        ) * 100,
        2
      )
    end as dropoff_rate
  from step_order current
  left join filtered_steps current_sessions
    on current_sessions.step_id = current.step_id
  left join step_order next_step
    on next_step.position = current.position + 1
  left join filtered_steps next_sessions
    on next_sessions.step_id = next_step.step_id
    and next_sessions.session_id = current_sessions.session_id
  left join filtered_results2_reached results2_reached
    on current.step_id = 'results2'
  left join filtered_cta_clicks cta_sessions
    on cta_sessions.session_id = case
      when current.step_id = 'results2' then results2_reached.session_id
      else current_sessions.session_id
    end
  group by current.position, current.step_id
  order by current.position;
$$;

create or replace function public.analytics_answer_distribution(
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_version text default null,
  p_environment text default null
)
returns table(
  question_id text,
  answer text,
  responses bigint,
  count bigint,
  percent numeric
)
language sql
stable
as $$
  with filtered_answers as (
    select question_id, answer_text, answer_json
    from public.quiz_events
    where event_type = 'answer'
      and question_id is not null
      and (p_from is null or created_at >= p_from)
      and (p_to is null or created_at < p_to)
      and (p_version is null or version = p_version)
      and (p_environment is null or environment = p_environment)
  ),
  answer_rows as (
    select question_id, answer_text as answer
    from filtered_answers
    where answer_text is not null

    union all

    select question_id, jsonb_array_elements_text(answer_json) as answer
    from filtered_answers
    where answer_json is not null
  ),
  response_counts as (
    select question_id, count(*)::bigint as responses
    from filtered_answers
    group by question_id
  )
  select
    answer_rows.question_id,
    answer_rows.answer,
    response_counts.responses,
    count(*)::bigint as count,
    case
      when response_counts.responses = 0 then 0
      else round((count(*)::numeric / response_counts.responses) * 100, 2)
    end as percent
  from answer_rows
  join response_counts
    on response_counts.question_id = answer_rows.question_id
  group by answer_rows.question_id, answer_rows.answer, response_counts.responses
  order by answer_rows.question_id, count desc, answer_rows.answer;
$$;

grant execute on function public.analytics_overview(timestamptz, timestamptz, text, text) to anon, authenticated;
grant execute on function public.analytics_funnel_summary(timestamptz, timestamptz, text, text) to anon, authenticated;
grant execute on function public.analytics_answer_distribution(timestamptz, timestamptz, text, text) to anon, authenticated;
