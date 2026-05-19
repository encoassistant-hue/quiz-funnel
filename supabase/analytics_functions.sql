do $$
declare
  event_type_udt text;
  environment_udt text;
  locale_udt text;
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

  alter table public.quiz_events
    add column if not exists locale text;

  update public.quiz_events
  set environment = 'prod'
  where environment is null;

  update public.quiz_events
  set locale = 'en-US'
  where locale is null;

  alter table public.quiz_events
    alter column environment set default 'prod';

  alter table public.quiz_events
    alter column environment set not null;

  alter table public.quiz_events
    alter column locale set default 'en-US';

  alter table public.quiz_events
    alter column locale set not null;

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

  select udt_name
  into locale_udt
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'quiz_events'
    and column_name = 'locale';

  if exists (
    select 1
    from pg_type
    where typname = locale_udt
      and typtype = 'e'
  ) then
    execute format('alter type %I add value if not exists ''en-US''', locale_udt);
    execute format('alter type %I add value if not exists ''de-DE''', locale_udt);
  else
    for constraint_name in
      select con.conname
      from pg_constraint con
      join pg_class rel on rel.oid = con.conrelid
      join pg_namespace nsp on nsp.oid = rel.relnamespace
      where nsp.nspname = 'public'
        and rel.relname = 'quiz_events'
        and con.contype = 'c'
        and pg_get_constraintdef(con.oid) like '%locale%'
    loop
      execute format('alter table public.quiz_events drop constraint %I', constraint_name);
    end loop;

    alter table public.quiz_events
      add constraint quiz_events_locale_check
      check (locale in ('en-US', 'de-DE'));
  end if;
end
$$;

create index if not exists quiz_events_analytics_filter_idx
  on public.quiz_events (event_type, environment, locale, version, created_at, session_id, step_id);

create index if not exists quiz_events_recent_idx
  on public.quiz_events (created_at desc, id desc);

create or replace function public.analytics_overview(
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_version text default null,
  p_environment text default null,
  p_locale text default null
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
    and (p_environment is null or environment = p_environment)
    and (p_locale is null or locale = p_locale);
$$;

create or replace function public.analytics_funnel_summary(
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_version text default null,
  p_environment text default null,
  p_locale text default null
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
  filtered_events as (
    select session_id, event_type, step_id
    from public.quiz_events
    where event_type in ('step_view', 'cta_click')
      and (
        event_type = 'step_view'
        or step_id = 'results2'
      )
      and (p_from is null or created_at >= p_from)
      and (p_to is null or created_at < p_to)
      and (p_version is null or version = p_version)
      and (p_environment is null or environment = p_environment)
      and (p_locale is null or locale = p_locale)
  ),
  session_flags as (
    select
      session_id,
      bool_or(event_type = 'step_view' and step_id = 'landing') as landing,
      bool_or(event_type = 'step_view' and step_id = 'q1') as q1,
      bool_or(event_type = 'step_view' and step_id = 'q2') as q2,
      bool_or(event_type = 'step_view' and step_id = 'q3') as q3,
      bool_or(event_type = 'step_view' and step_id = 'q4') as q4,
      bool_or(event_type = 'step_view' and step_id = 'q5') as q5,
      bool_or(event_type = 'step_view' and step_id = 'results1') as results1,
      bool_or(event_type = 'step_view' and step_id = 'q6') as q6,
      bool_or(event_type = 'step_view' and step_id = 'education') as education,
      bool_or(event_type = 'step_view' and step_id = 'q7') as q7,
      bool_or(event_type = 'step_view' and step_id = 'q8') as q8,
      bool_or(
        (event_type = 'step_view' and step_id = 'results2')
        or (event_type = 'cta_click' and step_id = 'results2')
      ) as results2,
      bool_or(event_type = 'cta_click' and step_id = 'results2') as results2_cta
    from filtered_events
    group by session_id
  ),
  step_flags as (
    select
      session_flags.session_id,
      flags.position,
      flags.step_id,
      flags.reached
    from session_flags
    cross join lateral (
      values
        (1, 'landing', session_flags.landing),
        (2, 'q1', session_flags.q1),
        (3, 'q2', session_flags.q2),
        (4, 'q3', session_flags.q3),
        (5, 'q4', session_flags.q4),
        (6, 'q5', session_flags.q5),
        (7, 'results1', session_flags.results1),
        (8, 'q6', session_flags.q6),
        (9, 'education', session_flags.education),
        (10, 'q7', session_flags.q7),
        (11, 'q8', session_flags.q8),
        (12, 'results2', session_flags.results2)
    ) as flags(position, step_id, reached)
  )
  select
    step_order.position as step_position,
    step_order.step_id,
    count(step_flags.session_id) filter (where step_flags.reached)::bigint as reached,
    case
      when step_order.step_id = 'results2'
        then count(session_flags.session_id) filter (where session_flags.results2_cta)::bigint
      else count(step_flags.session_id) filter (where step_flags.reached and next_flags.reached)::bigint
    end as continued,
    (
      count(step_flags.session_id) filter (where step_flags.reached)
      - case
          when step_order.step_id = 'results2'
            then count(session_flags.session_id) filter (where session_flags.results2_cta)
          else count(step_flags.session_id) filter (where step_flags.reached and next_flags.reached)
        end
    )::bigint as dropped,
    case
      when count(step_flags.session_id) filter (where step_flags.reached) = 0 then 0
      else round(
        (
          count(step_flags.session_id) filter (where step_flags.reached)
          - case
              when step_order.step_id = 'results2'
                then count(session_flags.session_id) filter (where session_flags.results2_cta)
              else count(step_flags.session_id) filter (where step_flags.reached and next_flags.reached)
            end
        )::numeric
        / count(step_flags.session_id) filter (where step_flags.reached)
        * 100,
        2
      )
    end as dropoff_rate
  from step_order
  left join step_flags
    on step_flags.position = step_order.position
  left join step_flags next_flags
    on next_flags.session_id = step_flags.session_id
    and next_flags.position = step_order.position + 1
  left join session_flags
    on session_flags.session_id = step_flags.session_id
  group by step_order.position, step_order.step_id
  order by step_order.position;
$$;

create or replace function public.analytics_answer_distribution(
  p_from timestamptz default null,
  p_to timestamptz default null,
  p_version text default null,
  p_environment text default null,
  p_locale text default null
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
      and (p_locale is null or locale = p_locale)
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

grant execute on function public.analytics_overview(timestamptz, timestamptz, text, text, text) to anon, authenticated;
grant execute on function public.analytics_funnel_summary(timestamptz, timestamptz, text, text, text) to anon, authenticated;
grant execute on function public.analytics_answer_distribution(timestamptz, timestamptz, text, text, text) to anon, authenticated;
