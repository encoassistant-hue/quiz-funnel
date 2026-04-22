'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AnalyticsEnvironment,
  AnswerDistributionRow,
  AnalyticsOverviewRow,
  buildAnalyticsParams,
  fetchRecentSupabaseEvents,
  fetchSupabaseRpc,
  FunnelSummaryRow,
  getSupabaseBrowserConfig,
  QUESTION_LABELS,
  QUESTION_ORDER,
  SupabaseEventRow,
} from '@/lib/analytics';

type DateRange = '24h' | '7d' | '30d' | 'all';
type EnvironmentFilter = AnalyticsEnvironment | 'all';
type VersionFilter = 'all' | 'a' | 'b';

const STEP_LABELS: Record<string, string> = {
  landing: 'Landing',
  q1: 'Q1: Age',
  q2: 'Q2: Pain location',
  q3: 'Q3: Morning stiffness',
  q4: 'Q4: Daily impact',
  q5: 'Q5: Pain duration',
  results1: 'Results screen 1',
  q6: 'Q6: Tried solutions',
  education: 'Education screen',
  q7: 'Q7: Biggest concern',
  q8: 'Q8: Motivation',
  results2: 'Final results screen',
};

function getRangeStart(range: DateRange) {
  if (range === 'all') return null;

  const now = Date.now();

  if (range === '24h') return now - 24 * 60 * 60 * 1000;
  if (range === '7d') return now - 7 * 24 * 60 * 60 * 1000;

  return now - 30 * 24 * 60 * 60 * 1000;
}

function getRangeFromIso(range: DateRange) {
  const start = getRangeStart(range);
  return start === null ? null : new Date(start).toISOString();
}

function getMostAbandonedScreen(rows: FunnelSummaryRow[]) {
  return rows.reduce<FunnelSummaryRow | null>((worst, row) => {
    if (!worst || Number(row.dropped) > Number(worst.dropped)) return row;
    return worst;
  }, null);
}

function getTopDropoffRows(rows: FunnelSummaryRow[], limit = 3) {
  return [...rows]
    .filter((row) => Number(row.reached) > 0 && Number(row.dropped) > 0)
    .sort((a, b) => Number(b.dropped) - Number(a.dropped))
    .slice(0, limit);
}

function getFinalCtaRow(rows: FunnelSummaryRow[]) {
  return rows.find((row) => row.step_id === 'results2') ?? null;
}

function getAverageScreensPerSession(rows: FunnelSummaryRow[], sessionCount: number) {
  if (sessionCount === 0) return 0;
  const totalScreensViewed = rows.reduce((sum, row) => sum + Number(row.reached), 0);
  return totalScreensViewed / sessionCount;
}

function getAverageQuestionsPerSession(rows: FunnelSummaryRow[], sessionCount: number) {
  if (sessionCount === 0) return 0;
  const totalQuestionsViewed = rows
    .filter((row) => row.step_id.startsWith('q'))
    .reduce((sum, row) => sum + Number(row.reached), 0);
  return totalQuestionsViewed / sessionCount;
}

function getFinalScreenReachRate(finalCtaRow: FunnelSummaryRow | null, sessionCount: number) {
  if (!finalCtaRow || sessionCount === 0) return 0;
  return (Number(finalCtaRow.reached) / sessionCount) * 100;
}

function getFinalCtaConversionRate(finalCtaRow: FunnelSummaryRow | null) {
  if (!finalCtaRow) return 0;
  return 100 - Number(finalCtaRow.dropoff_rate);
}

function getStepLabel(stepId: string) {
  return STEP_LABELS[stepId] ?? stepId;
}

function groupAnswerRows(rows: AnswerDistributionRow[]) {
  const grouped = rows.reduce<Record<string, AnswerDistributionRow[]>>((acc, row) => {
    acc[row.question_id] ??= [];
    acc[row.question_id].push(row);
    return acc;
  }, {});

  return QUESTION_ORDER.map((questionId) => ({
    questionId,
    question: QUESTION_LABELS[questionId],
    responses: grouped[questionId]?.[0]?.responses ?? 0,
    distribution: grouped[questionId] ?? [],
  }));
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverviewRow | null>(null);
  const [funnelRows, setFunnelRows] = useState<FunnelSummaryRow[]>([]);
  const [answerRows, setAnswerRows] = useState<AnswerDistributionRow[]>([]);
  const [recentEvents, setRecentEvents] = useState<SupabaseEventRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [environmentFilter, setEnvironmentFilter] = useState<EnvironmentFilter>('prod');
  const [versionFilter, setVersionFilter] = useState<VersionFilter>('all');

  const loadAnalytics = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError(null);

    try {
      const config = getSupabaseBrowserConfig();
      const params = buildAnalyticsParams({
        from: getRangeFromIso(dateRange),
        to: null,
        environment: environmentFilter,
        version: versionFilter,
      });

      const [overviewData, funnelData, answersData, recentData] = await Promise.all([
        fetchSupabaseRpc<AnalyticsOverviewRow[]>(config, 'analytics_overview', params),
        fetchSupabaseRpc<FunnelSummaryRow[]>(config, 'analytics_funnel_summary', params),
        fetchSupabaseRpc<AnswerDistributionRow[]>(config, 'analytics_answer_distribution', params),
        fetchRecentSupabaseEvents(config, {
          from: params.p_from,
          to: params.p_to,
          environment: environmentFilter,
          version: versionFilter,
          limit: 25,
        }),
      ]);

      setOverview(overviewData[0] ?? null);
      setFunnelRows(funnelData);
      setAnswerRows(answersData);
      setRecentEvents(recentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange, environmentFilter, versionFilter]);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const groupedAnswers = useMemo(() => groupAnswerRows(answerRows), [answerRows]);
  const mostAbandonedScreen = useMemo(() => getMostAbandonedScreen(funnelRows), [funnelRows]);
  const topDropoffRows = useMemo(() => getTopDropoffRows(funnelRows), [funnelRows]);
  const finalCtaRow = useMemo(() => getFinalCtaRow(funnelRows), [funnelRows]);
  const finalScreenReachRate = useMemo(
    () => getFinalScreenReachRate(finalCtaRow, overview?.total_sessions ?? 0),
    [finalCtaRow, overview?.total_sessions]
  );
  const finalCtaConversionRate = useMemo(() => getFinalCtaConversionRate(finalCtaRow), [finalCtaRow]);
  const averageScreensPerSession = useMemo(
    () => getAverageScreensPerSession(funnelRows, overview?.total_sessions ?? 0),
    [funnelRows, overview?.total_sessions]
  );
  const averageQuestionsPerSession = useMemo(
    () => getAverageQuestionsPerSession(funnelRows, overview?.total_sessions ?? 0),
    [funnelRows, overview?.total_sessions]
  );

  const exportCsv = useCallback(() => {
    const rows = [
      ['section', 'key', 'label', 'value', 'extra_1', 'extra_2'],
      ['overview', 'total_events', 'Total events', String(overview?.total_events ?? 0), '', ''],
      ['overview', 'total_sessions', 'Total sessions', String(overview?.total_sessions ?? 0), '', ''],
      ['overview', 'avg_screens_per_session', 'Average screens per session', averageScreensPerSession.toFixed(2), '', ''],
      ['overview', 'avg_questions_per_session', 'Average questions per session', averageQuestionsPerSession.toFixed(2), '', ''],
      [
        'overview',
        'most_abandoned_screen',
        'Most abandoned screen',
        mostAbandonedScreen ? getStepLabel(mostAbandonedScreen.step_id) : '',
        String(mostAbandonedScreen?.dropped ?? 0),
        mostAbandonedScreen ? `${Number(mostAbandonedScreen.dropoff_rate).toFixed(1)}%` : '',
      ],
      ['overview', 'final_screen_reach_rate', 'Final screen reach rate', `${finalScreenReachRate.toFixed(1)}%`, String(finalCtaRow?.reached ?? 0), ''],
      [
        'overview',
        'final_cta_clicks',
        'Final CTA clicks',
        String(finalCtaRow?.continued ?? 0),
        String(finalCtaRow?.reached ?? 0),
        finalCtaRow ? `${finalCtaConversionRate.toFixed(1)}%` : '',
      ],
      ...funnelRows.map((row) => [
        'funnel',
        row.step_id,
        row.step_id,
        String(row.reached),
        String(row.dropped),
        String(row.dropoff_rate),
      ]),
      ...answerRows.map((row) => [
        'answers',
        row.question_id,
        row.answer,
        String(row.count),
        String(row.responses),
        String(row.percent),
      ]),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const suffix = `${environmentFilter}-${versionFilter}-${dateRange}`;

    link.href = url;
    link.download = `quiz-analytics-summary-${suffix}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [
    answerRows,
    averageQuestionsPerSession,
    averageScreensPerSession,
    dateRange,
    environmentFilter,
    finalCtaConversionRate,
    funnelRows,
    finalCtaRow,
    finalScreenReachRate,
    mostAbandonedScreen,
    overview,
    versionFilter,
  ]);

  return (
    <main className="min-h-screen bg-stone-950 px-4 py-10 text-stone-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Quiz Analytics</h1>
          <p className="text-sm text-stone-400">
            Supabase-backed funnel summaries, answer distribution, and a lightweight recent event stream.
          </p>
        </div>

        <section className="flex flex-col gap-4 rounded-2xl border border-stone-800 bg-stone-900 p-5">
          <div className="flex flex-wrap gap-2">
            {(['24h', '7d', '30d', 'all'] as DateRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setDateRange(range)}
                className={
                  dateRange === range
                    ? 'rounded-full bg-amber-400 px-4 py-2 text-sm font-medium text-stone-950'
                    : 'rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300'
                }
              >
                {range === 'all' ? 'All time' : range}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {(['prod', 'dev', 'preview', 'all'] as EnvironmentFilter[]).map((environment) => (
              <button
                key={environment}
                type="button"
                onClick={() => setEnvironmentFilter(environment)}
                className={
                  environmentFilter === environment
                    ? 'rounded-full bg-emerald-400 px-4 py-2 text-sm font-medium text-stone-950'
                    : 'rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300'
                }
              >
                {environment === 'all' ? 'All environments' : environment.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {(['all', 'a', 'b'] as VersionFilter[]).map((version) => (
              <button
                key={version}
                type="button"
                onClick={() => setVersionFilter(version)}
                className={
                  versionFilter === version
                    ? 'rounded-full bg-sky-400 px-4 py-2 text-sm font-medium text-stone-950'
                    : 'rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300'
                }
              >
                {version === 'all' ? 'All versions' : `Version ${version.toUpperCase()}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              type="button"
              onClick={exportCsv}
              disabled={!overview}
              className="rounded-full border border-stone-700 px-4 py-2 text-sm font-medium text-stone-200 disabled:opacity-50"
            >
              Export Summary CSV
            </button>
            <button
              type="button"
              onClick={() => void loadAnalytics(true)}
              disabled={refreshing}
              className="rounded-full border border-stone-700 px-4 py-2 text-sm font-medium text-stone-200 disabled:opacity-50"
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </section>

        {loading && <p className="text-stone-300">Loading analytics...</p>}
        {error && <p className="text-red-300">{error}</p>}

        {!loading && !error && (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-emerald-800/60 bg-gradient-to-br from-emerald-950 to-stone-900 p-6">
                <p className="text-sm text-emerald-300">Final CTA conversion</p>
                <p className="mt-3 text-4xl font-semibold">{finalCtaConversionRate.toFixed(1)}%</p>
                <p className="mt-2 text-sm text-stone-300">
                  {finalCtaRow
                    ? `${finalCtaRow.continued} clicks from ${finalCtaRow.reached} final-screen views`
                    : 'No final-screen data yet'}
                </p>
              </div>
              <div className="rounded-2xl border border-sky-800/60 bg-gradient-to-br from-sky-950 to-stone-900 p-6">
                <p className="text-sm text-sky-300">Final screen reach</p>
                <p className="mt-3 text-4xl font-semibold">{finalScreenReachRate.toFixed(1)}%</p>
                <p className="mt-2 text-sm text-stone-300">
                  {finalCtaRow
                    ? `${finalCtaRow.reached} of ${overview?.total_sessions ?? 0} sessions reached the last screen`
                    : 'No final-screen data yet'}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-800/60 bg-gradient-to-br from-amber-950 to-stone-900 p-6">
                <p className="text-sm text-amber-300">Biggest abandonment point</p>
                <p className="mt-3 text-2xl font-semibold">
                  {mostAbandonedScreen ? getStepLabel(mostAbandonedScreen.step_id) : 'No data yet'}
                </p>
                <p className="mt-2 text-sm text-stone-300">
                  {mostAbandonedScreen
                    ? `${mostAbandonedScreen.dropped} sessions dropped here (${Number(mostAbandonedScreen.dropoff_rate).toFixed(1)}%)`
                    : 'No drop-off data yet'}
                </p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
                <p className="text-sm text-stone-400">Environment</p>
                <p className="mt-2 text-3xl font-semibold uppercase">{environmentFilter}</p>
              </div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
                <p className="text-sm text-stone-400">Sessions in range</p>
                <p className="mt-2 text-3xl font-semibold">{overview?.total_sessions ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
                <p className="text-sm text-stone-400">Events in range</p>
                <p className="mt-2 text-3xl font-semibold">{overview?.total_events ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
                <p className="text-sm text-stone-400">Avg screens per session</p>
                <p className="mt-2 text-3xl font-semibold">{averageScreensPerSession.toFixed(1)}</p>
              </div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
                <p className="text-sm text-stone-400">Avg questions per session</p>
                <p className="mt-2 text-3xl font-semibold">{averageQuestionsPerSession.toFixed(1)}</p>
              </div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
                <p className="text-sm text-stone-400">Most abandoned screen</p>
                <p className="mt-2 text-lg font-semibold">
                  {mostAbandonedScreen ? getStepLabel(mostAbandonedScreen.step_id) : 'No data yet'}
                </p>
                <p className="mt-1 text-sm text-stone-400">
                  {mostAbandonedScreen ? `${mostAbandonedScreen.dropped} dropped` : 'No drop-off data yet'}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Top Drop-off Points</h2>
                  <p className="mt-1 text-sm text-stone-400">The screens losing the most sessions in the selected range.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {topDropoffRows.length === 0 && <p className="text-sm text-stone-400">No drop-offs recorded yet.</p>}
                {topDropoffRows.map((row) => (
                  <article key={row.step_id} className="rounded-xl border border-stone-800 bg-stone-950/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-stone-500">{row.step_id}</p>
                    <h3 className="mt-1 font-medium">{getStepLabel(row.step_id)}</h3>
                    <p className="mt-3 text-2xl font-semibold">{row.dropped}</p>
                    <p className="text-sm text-stone-400">sessions dropped</p>
                    <div className="mt-3 h-2 rounded-full bg-stone-800">
                      <div
                        className="h-2 rounded-full bg-amber-400"
                        style={{ width: `${Math.min(Number(row.dropoff_rate), 100)}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-stone-400">{Number(row.dropoff_rate).toFixed(1)}% drop-off, {row.reached} reached</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
              <h2 className="text-xl font-semibold">Funnel Drop-off</h2>
              <p className="mt-1 text-sm text-stone-400">`continued` means the next step was reached, except on `results2` where it means the final CTA was clicked.</p>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-stone-400">
                    <tr>
                      <th className="pb-3 pr-6">Step</th>
                      <th className="pb-3 pr-6">Reached</th>
                      <th className="pb-3 pr-6">Continued</th>
                      <th className="pb-3 pr-6">Dropped</th>
                      <th className="pb-3">Drop-off</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funnelRows.map((row) => (
                      <tr key={row.step_id} className="border-t border-stone-800">
                        <td className="py-3 pr-6 font-medium">
                          <div>{getStepLabel(row.step_id)}</div>
                          <div className="text-xs text-stone-500">{row.step_id}</div>
                        </td>
                        <td className="py-3 pr-6">{Number(row.reached)}</td>
                        <td className="py-3 pr-6">{Number(row.continued)}</td>
                        <td className="py-3 pr-6">{Number(row.dropped)}</td>
                        <td className="py-3">
                          <div className="font-medium">{Number(row.dropoff_rate).toFixed(1)}%</div>
                          <div className="mt-2 h-2 w-28 rounded-full bg-stone-800">
                            <div
                              className="h-2 rounded-full bg-amber-400"
                              style={{ width: `${Math.min(Number(row.dropoff_rate), 100)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
              <h2 className="text-xl font-semibold">Answer Distribution</h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {groupedAnswers.map((question) => (
                  <article key={question.questionId} className="rounded-xl border border-stone-800 bg-stone-950/60 p-4">
                    <p className="text-sm text-stone-400">{question.questionId}</p>
                    <h3 className="mt-1 font-medium">{question.question}</h3>
                    <p className="mt-1 text-sm text-stone-400">Responses: {question.responses}</p>
                    <div className="mt-4 space-y-3">
                      {question.distribution.length === 0 && <p className="text-sm text-stone-500">No answers yet.</p>}
                      {question.distribution.map((option) => (
                        <div key={option.answer} className="space-y-1">
                          <div className="flex items-center justify-between gap-4 text-sm">
                            <span>{option.answer}</span>
                            <span className="text-stone-400">
                              {option.count} ({Number(option.percent).toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-stone-800">
                            <div
                              className="h-2 rounded-full bg-amber-400"
                              style={{ width: `${Math.min(Number(option.percent), 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-stone-800 bg-stone-900 p-5">
              <h2 className="text-xl font-semibold">Recent Events</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-stone-400">
                    <tr>
                      <th className="pb-3 pr-6">Time</th>
                      <th className="pb-3 pr-6">Session</th>
                      <th className="pb-3 pr-6">Type</th>
                      <th className="pb-3 pr-6">Env</th>
                      <th className="pb-3 pr-6">Step</th>
                      <th className="pb-3 pr-6">Question</th>
                      <th className="pb-3">Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((event, index) => (
                      <tr key={`${event.session_id}-${event.created_at}-${index}`} className="border-t border-stone-800 align-top">
                        <td className="py-3 pr-6 text-stone-400">{new Date(event.created_at).toLocaleString()}</td>
                        <td className="py-3 pr-6 font-mono text-xs text-stone-300">{event.session_id}</td>
                        <td className="py-3 pr-6">{event.event_type}</td>
                        <td className="py-3 pr-6 uppercase text-stone-400">{event.environment}</td>
                        <td className="py-3 pr-6">{event.step_id}</td>
                        <td className="py-3 pr-6">{event.question_id ? QUESTION_LABELS[event.question_id] : '-'}</td>
                        <td className="py-3">{event.answer_text ?? (event.answer_json ? event.answer_json.join(', ') : '-')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
