export type StepId =
  | 'landing'
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'q5'
  | 'results1'
  | 'q6'
  | 'education'
  | 'q7'
  | 'q8'
  | 'results2';

export type QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8';
export type AnalyticsEnvironment = 'dev' | 'preview' | 'prod';

export type AnalyticsEvent = {
  sessionId: string;
  timestamp: string;
  version: 'a' | 'b';
  environment: AnalyticsEnvironment;
  eventType: 'step_view' | 'answer' | 'cta_click';
  stepId: StepId;
  questionId?: QuestionId;
  answerText?: string;
  answerJson?: string[];
};

export type SupabaseEventRow = {
  id?: string;
  created_at: string;
  session_id: string;
  version: 'a' | 'b';
  environment: AnalyticsEnvironment;
  event_type: 'step_view' | 'answer' | 'cta_click';
  step_id: StepId;
  question_id: QuestionId | null;
  answer_text: string | null;
  answer_json: string[] | null;
};

export type AnalyticsOverviewRow = {
  total_events: number;
  total_sessions: number;
  first_event_at: string | null;
  last_event_at: string | null;
};

export type FunnelSummaryRow = {
  step_position: number;
  step_id: StepId;
  reached: number;
  continued: number;
  dropped: number;
  dropoff_rate: number;
};

export type AnswerDistributionRow = {
  question_id: QuestionId;
  answer: string;
  responses: number;
  count: number;
  percent: number;
};

export const QUESTION_ORDER: QuestionId[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];

export const QUESTION_LABELS: Record<QuestionId, string> = {
  q1: 'How old are you?',
  q2: 'Where do you feel your pain most?',
  q3: 'Do you experience stiffness or pain after sitting?',
  q4: 'How much does your back pain affect your daily life?',
  q5: 'How long have you been dealing with this pain?',
  q6: 'What solutions have you tried before?',
  q7: "What's your biggest concern if your back pain continues unchanged?",
  q8: 'How motivated are you to fix your back pain?',
};

export function toSupabaseRow(event: AnalyticsEvent): SupabaseEventRow {
  return {
    created_at: event.timestamp,
    session_id: event.sessionId,
    version: event.version,
    environment: event.environment,
    event_type: event.eventType,
    step_id: event.stepId,
    question_id: event.questionId ?? null,
    answer_text: event.answerText ?? null,
    answer_json: event.answerJson ?? null,
  };
}

export function getSupabaseBrowserConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
  }

  return { url, key };
}

export function getAnalyticsEnvironment(): AnalyticsEnvironment {
  const configured = process.env.NEXT_PUBLIC_ANALYTICS_ENV;

  if (configured === 'dev' || configured === 'preview' || configured === 'prod') {
    return configured;
  }

  return process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
}

export function buildAnalyticsParams(input: {
  from: string | null;
  to: string | null;
  version: 'a' | 'b' | 'all';
  environment: AnalyticsEnvironment | 'all';
}) {
  return {
    p_from: input.from,
    p_to: input.to,
    p_version: input.version === 'all' ? null : input.version,
    p_environment: input.environment === 'all' ? null : input.environment,
  };
}

export async function fetchSupabaseRpc<T>(
  config: { url: string; key: string },
  fn: string,
  params: Record<string, string | null>
) {
  const response = await fetch(`${config.url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to load analytics.');
  }

  return (await response.json()) as T;
}

export async function fetchRecentSupabaseEvents(
  config: { url: string; key: string },
  params: {
    from: string | null;
    to: string | null;
    version: 'a' | 'b' | 'all';
    environment: AnalyticsEnvironment | 'all';
    limit?: number;
  }
) {
  const searchParams = new URLSearchParams();
  searchParams.set('select', '*');
  searchParams.set('order', 'created_at.desc,id.desc');
  searchParams.set('limit', String(params.limit ?? 25));

  if (params.from) {
    searchParams.append('created_at', `gte.${params.from}`);
  }

  if (params.to) {
    searchParams.append('created_at', `lt.${params.to}`);
  }

  if (params.version !== 'all') {
    searchParams.set('version', `eq.${params.version}`);
  }

  if (params.environment !== 'all') {
    searchParams.set('environment', `eq.${params.environment}`);
  }

  const response = await fetch(`${config.url}/rest/v1/quiz_events?${searchParams.toString()}`, {
    cache: 'no-store',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to load recent events.');
  }

  return (await response.json()) as SupabaseEventRow[];
}
