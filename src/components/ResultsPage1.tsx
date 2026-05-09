'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ResultsPage1Content } from '@/lib/quizData';
import { withBasePath } from '@/lib/withBasePath';

interface ResultsPage1Props {
  onContinue: () => void;
  content: ResultsPage1Content;
}

export default function ResultsPage1({ onContinue, content }: ResultsPage1Props) {
  useEffect(() => {
    let cancelled = false;
    let rafId: number;

    const cancel = () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };

    // Cancel if user interacts before timer fires or during the animation
    window.addEventListener('wheel', cancel, { once: true, passive: true });
    window.addEventListener('touchstart', cancel, { once: true, passive: true });

    const timer = setTimeout(() => {
      if (cancelled) return;

      const hasScrollableContent =
        document.documentElement.scrollHeight > window.innerHeight;
      const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!hasScrollableContent || prefersReducedMotion) {
        window.removeEventListener('wheel', cancel);
        window.removeEventListener('touchstart', cancel);
        return;
      }

      const startY = window.scrollY;
      const targetY = document.body.scrollHeight;
      const distance = targetY - startY;
      const duration = 2500; // ms — slow, deliberate scroll
      const startTime = performance.now();

      const step = (currentTime: number) => {
        if (cancelled) return;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeInOutCubic
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        window.scrollTo(0, startY + distance * ease);
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          window.removeEventListener('wheel', cancel);
          window.removeEventListener('touchstart', cancel);
        }
      };

      rafId = requestAnimationFrame(step);
    }, 1500);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10 max-md:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <p className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-2">{content.badge}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-1">{content.title}</h2>
          <p className="text-stone-500 text-sm">{content.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-stone-600 font-medium text-sm">{content.severityLabel}</span>
            <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">
              {content.severityValue}
            </span>
          </div>

          <div className="w-full rounded-xl overflow-hidden mb-5">
            <Image
              src={withBasePath(content.inflamedImage)}
              alt="SI Joint inflammation"
              width={1408}
              height={768}
              className="w-full h-auto"
            />
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-xs text-stone-400 mb-1">
              <span>{content.scaleLabels[0]}</span>
              <span>{content.scaleLabels[1]}</span>
              <span>{content.scaleLabels[2]}</span>
              <span className="font-bold text-red-500">{content.scaleLabels[3]}</span>
            </div>
            <div className="h-3 rounded-full bg-linear-to-r from-green-300 via-yellow-300 via-orange-400 to-red-500 relative">
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: '95%' }}
                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-red-500 rounded-full shadow-md"
                style={{ transform: 'translateX(-50%) translateY(-50%)' }}
              />
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3">
          <span className="text-xl shrink-0">⚠️</span>
          <p className="text-red-800 text-sm leading-relaxed">
            <strong>{content.warningTitle}</strong> {content.warningBody}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
              <th className="text-left px-4 py-3 text-stone-500 font-semibold">{content.tableHeaders[0]}</th>
              <th className="text-right px-4 py-3 text-stone-500 font-semibold">{content.tableHeaders[1]}</th>
              </tr>
            </thead>
            <tbody>
              {content.metrics.map((row, i) => (
                <tr key={row.label} className={i < 2 ? 'border-b border-stone-100' : ''}>
                  <td className="px-4 py-3 text-stone-600">{row.label}</td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      row.highlight ? 'text-red-500' : 'text-stone-700'
                    }`}
                  >
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-sm border-t border-stone-200 px-6 py-3 md:static md:bg-transparent md:border-0 md:p-0"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg tracking-wide transition-colors duration-200"
          >
            {content.continueLabel}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
