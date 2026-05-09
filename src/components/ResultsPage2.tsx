'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ResultsPage2Content } from '@/lib/quizData';
import { LocalizationLocale } from '@/lib/types';
import { withBasePath } from '@/lib/withBasePath';

interface ResultsPage2Props {
  onClaimDiscount?: () => void;
  content: ResultsPage2Content;
  locale: LocalizationLocale;
  productUrl: string;
}

function getDynamicDate(daysFromNow: number, locale: LocalizationLocale): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function ResultsPage2({ onClaimDiscount, content, locale, productUrl }: ResultsPage2Props) {
  const thirtyDaysOut = getDynamicDate(30, locale);

  useEffect(() => {
    let cancelled = false;
    let rafId: number;

    const cancel = () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };

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
    <div className="w-full max-w-xl mx-auto px-6 py-10 max-md:pb-31.25">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span>✅</span> {content.badge}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 leading-snug">
            {content.titleStart} <span className="text-amber-500">{content.titleHighlight}</span> {content.titleEnd}
          </h2>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-lg shrink-0">✅</span>
            <p className="text-stone-700 text-sm leading-relaxed">{content.checklist[0]}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-lg shrink-0">✅</span>
            <p className="text-stone-700 text-sm leading-relaxed">{content.checklist[1].replace('{date}', thirtyDaysOut)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <div className="w-full rounded-lg overflow-hidden mb-2">
              <Image
                src={withBasePath(content.inflamedImage)}
                alt="SI Joint inflamed"
                width={1408}
                height={768}
                className="w-full h-auto"
              />
            </div>
            <p className="text-red-600 text-xs font-bold">{content.nowLabel}</p>
            <p className="text-red-400 text-xs">{content.nowSubLabel}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="w-full rounded-lg overflow-hidden mb-2">
              <Image
                src={withBasePath(content.stabilizedImage)}
                alt="SI Joint stabilised"
                width={1408}
                height={768}
                className="w-full h-auto"
              />
            </div>
            <p className="text-green-700 text-xs font-bold">{content.goalLabel}</p>
            <p className="text-green-500 text-xs">{content.goalSubLabel}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-4 py-3 text-stone-500 font-semibold">{content.comparisonHeaders[0]}</th>
                <th className="text-center px-3 py-3  font-bold">{content.comparisonHeaders[1]}</th>
                <th className="text-center px-3 py-3  font-bold">{content.comparisonHeaders[2]}</th>
              </tr>
            </thead>
            <tbody>
              {content.comparisonRows.map((row, i) => (
                <tr key={row.metric} className={i < 2 ? 'border-b border-stone-100' : ''}>
                  <td className="px-4 py-3 text-stone-600 font-medium">{row.metric}</td>
                  <td className="px-3 py-3 text-center text-red-500 text-xs">{row.now}</td>
                  <td className="px-3 py-3 text-center text-green-600 text-xs font-semibold">
                    {row.goal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-amber-800 text-sm font-medium">🎉 {content.offerText}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-sm border-t border-stone-200 px-6 py-3 md:static md:bg-transparent md:border-0 md:p-0"
        >
          <motion.a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClaimDiscount}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="block w-full py-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xl tracking-wide text-center transition-colors duration-200 shadow-lg shadow-amber-200"
          >
            {content.ctaLabel} ▷
          </motion.a>

          <p className="text-center text-stone-400 text-xs mt-3">
            {content.guaranteeText}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
