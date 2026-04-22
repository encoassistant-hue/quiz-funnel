'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Screen, Answers, Version } from '@/lib/types';
import { QUESTIONS, getNextScreen } from '@/lib/quizData';
import { getAnalyticsEnvironment, getSupabaseBrowserConfig, toSupabaseRow } from '@/lib/analytics';
import QuizHeader from './QuizHeader';
import LandingPage from './LandingPage';
import QuizQuestion from './QuizQuestion';
import ResultsPage1 from './ResultsPage1';
import EducationSlide from './EducationSlide';
import ResultsPage2 from './ResultsPage2';

const SESSION_STORAGE_KEY = 'quiz-funnel-session-id';

function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

interface QuizFunnelProps {
  version: Version;
}

const slideVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function QuizFunnel({ version }: QuizFunnelProps) {
  const genderOptions = ['Male', 'Female'] as const;
  const environment = getAnalyticsEnvironment();
  const initialScreen: Screen = version === 'b' ? 'landing' : 'q1';
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState(1);
  const sessionIdRef = useRef('');
  const lastTrackedScreenRef = useRef<Screen | null>(null);

  const trackEvent = useCallback(
    (payload: {
      eventType: 'step_view' | 'answer' | 'cta_click';
      stepId: Screen;
      questionId?: keyof Omit<Answers, 'gender'>;
      answerText?: string;
      answerJson?: string[];
    }) => {
      if (!sessionIdRef.current) return;

      let config;
      try {
        config = getSupabaseBrowserConfig();
      } catch {
        return;
      }

      void fetch(`${config.url}/rest/v1/quiz_events`, {
        method: 'POST',
        keepalive: true,
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(
          toSupabaseRow({
            sessionId: sessionIdRef.current,
            timestamp: new Date().toISOString(),
            version,
            environment,
            ...payload,
          })
        ),
      }).then(async (response) => {
        if (response.ok) return;

        const text = await response.text();
        console.error('Failed to track analytics event', payload.eventType, text || response.statusText);
      }).catch((error) => {
        console.error('Failed to track analytics event', payload.eventType, error);
      });
    },
    [environment, version]
  );

  useEffect(() => {
    const existingSessionId = window.localStorage.getItem(SESSION_STORAGE_KEY);
    const sessionId = existingSessionId ?? createSessionId();

    if (!existingSessionId) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }

    sessionIdRef.current = sessionId;
  }, []);

  useEffect(() => {
    if (!sessionIdRef.current || lastTrackedScreenRef.current === screen) {
      return;
    }

    lastTrackedScreenRef.current = screen;
    trackEvent({ eventType: 'step_view', stepId: screen });
  }, [screen, trackEvent]);

  const advance = useCallback(
    (nextScreen?: Screen) => {
      window.scrollTo(0, 0);
      setDirection(1);
      setScreen((cur) => nextScreen ?? getNextScreen(cur, version));
    },
    [version]
  );

  function handleAnswer(questionId: keyof Omit<Answers, 'gender'>, value: string | string[]) {
    trackEvent({
      eventType: 'answer',
      stepId: questionId,
      questionId,
      answerText: typeof value === 'string' ? value : undefined,
      answerJson: Array.isArray(value) ? value : undefined,
    });

    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    advance();
  }

  function handleGenderSelect(gender: string) {
    trackEvent({ eventType: 'answer', stepId: 'landing', answerText: gender });
    setAnswers((prev) => ({ ...prev, gender }));
    advance('q1');
  }

  const showHeader = screen !== 'landing';

  const questionConfig = QUESTIONS.find((q) => q.screen === screen);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      {showHeader && <QuizHeader screen={screen} />}

      <div className="flex-1 flex items-start justify-center">
        {screen === 'landing' ? (
          <LandingPage onGenderSelect={handleGenderSelect} />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={screen}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full"
            >
              {questionConfig && (
                <QuizQuestion
                  config={questionConfig}
                  currentAnswer={answers[questionConfig.id]}
                  onAnswer={(val) => handleAnswer(questionConfig.id, val)}
                />
              )}

              {screen === 'results1' && <ResultsPage1 onContinue={() => advance()} />}

              {screen === 'education' && <EducationSlide onContinue={() => advance()} />}

              {screen === 'results2' && (
                <ResultsPage2 onClaimDiscount={() => trackEvent({ eventType: 'cta_click', stepId: 'results2' })} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {screen === 'landing' && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/70 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] backdrop-blur-md md:hidden"
        >
          <p className="text-center text-white/60 text-[11px] uppercase tracking-[0.2em] mb-3">
            Take the free 60-second quiz
          </p>
          <div className="flex gap-3">
            {genderOptions.map((gender) => (
              <motion.button
                key={`sticky-${gender}`}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGenderSelect(gender.toLowerCase())}
                className="flex-1 rounded-xl bg-amber-500 py-4 text-base font-bold tracking-wide text-white shadow-lg shadow-amber-500/20 transition-colors duration-200 active:bg-amber-600"
              >
                {gender === 'Male' ? '♂ ' : '♀ '}
                {gender.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
