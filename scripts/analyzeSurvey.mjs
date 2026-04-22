import fs from 'node:fs';
import path from 'node:path';

const QUESTION_LABELS = {
  q1: 'How old are you?',
  q2: 'Where do you feel your pain most?',
  q3: 'Do you experience stiffness or pain after sitting?',
  q4: 'How much does your back pain affect your daily life?',
  q5: 'How long have you been dealing with this pain?',
  q6: 'What solutions have you tried before?',
  q7: "What's your biggest concern if your back pain continues unchanged?",
  q8: 'How motivated are you to fix your back pain?',
};

function loadEnvFile(fileName) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

async function rpc(fn, params = {}) {
  const url = getEnv('SUPABASE_URL');
  const key = getEnv('SUPABASE_PUBLISHABLE_KEY');
  const response = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch ${fn}: ${response.status} ${text}`);
  }

  return response.json();
}

function printReport(funnelRows, answerRows) {
  console.log('\nFunnel drop-off\n');
  for (const row of funnelRows) {
    console.log(
      `${row.step_id.padEnd(10)} reached=${String(row.reached).padStart(4)} ` +
        `continued=${String(row.continued).padStart(4)} ` +
        `dropped=${String(row.dropped).padStart(4)} ` +
        `drop-off=${Number(row.dropoff_rate).toFixed(1)}%`
    );
  }

  const worstQuestion = funnelRows
    .filter((row) => row.step_id.startsWith('q'))
    .reduce((worst, row) => {
      if (!worst || row.dropped > worst.dropped) return row;
      return worst;
    }, null);

  if (worstQuestion) {
    console.log(
      `\nHighest question drop-off\n${worstQuestion.step_id} (${QUESTION_LABELS[worstQuestion.step_id]}): ` +
        `${worstQuestion.dropped} users dropped (${Number(worstQuestion.dropoff_rate).toFixed(1)}%)`
    );
  }

  console.log('\nAnswer distribution\n');
  const grouped = answerRows.reduce((acc, row) => {
    acc[row.question_id] ??= [];
    acc[row.question_id].push(row);
    return acc;
  }, {});

  for (const [questionId, label] of Object.entries(QUESTION_LABELS)) {
    const rows = grouped[questionId] ?? [];
    console.log(`${questionId} - ${label}`);
    console.log(`responses=${rows[0]?.responses ?? 0}`);
    for (const row of rows) {
      console.log(`  ${row.answer}: ${row.count} (${Number(row.percent).toFixed(1)}%)`);
    }
    console.log('');
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

try {
  const defaultParams = { p_from: null, p_to: null, p_version: null };
  const [funnelRows, answerRows] = await Promise.all([
    rpc('analytics_funnel_summary', defaultParams),
    rpc('analytics_answer_distribution', defaultParams),
  ]);

  if (funnelRows.length === 0) {
    console.log('No quiz events found in Supabase yet.');
    process.exit(0);
  }

  printReport(funnelRows, answerRows);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
