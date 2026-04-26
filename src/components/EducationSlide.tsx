'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { withBasePath } from '@/lib/withBasePath';

interface EducationSlideProps {
  onContinue: () => void;
}

export default function EducationSlide({ onContinue }: EducationSlideProps) {
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
      const duration = 2500;
      const startTime = performance.now();

      const step = (currentTime: number) => {
        if (cancelled) return;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
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
    <div className="w-full max-w-xl mx-auto px-6 py-10 max-md:pb-20 max-md:min-h-[calc(100dvh+2px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <p className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-3">
            The truth about back pain
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 leading-snug">
            Why does nothing work on chronic back pain &amp; sciatica?
          </h2>
        </div>

        {/* Key insight */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <p className="text-stone-700 text-base leading-relaxed text-center">
            Stretching, physiotherapy, and pain medication{' '}
            <strong className="text-stone-900">don&#39;t work long-term </strong> because they don&#39;t
            address the SI joint — the <strong className="text-amber-700">real source</strong> of
            your pain.
          </p>
        </div>

        {/* Side-by-side illustration */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Left: pain */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <div className="relative w-full rounded-lg overflow-hidden mb-3 aspect-4/3">
              <Image
                src={withBasePath('/education/treatments-dont-work.png')}
                alt="Treatments that don't work"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="space-y-1.5">
              {['Pain pills ✗', 'Stretching ✗', 'Physio ✗'].map((t) => (
                <div key={t} className="text-red-600 text-xs font-medium bg-red-100 rounded-md px-2 py-1">
                  {t}
                </div>
              ))}
            </div>
            <p className="text-red-500 text-xs mt-2 font-medium">Treats symptoms only</p>
          </div>

          {/* Right: solution */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="relative w-full rounded-lg overflow-hidden mb-3 aspect-4/3">
              <Image
                src={withBasePath('/education/orthobelt-root-cause-fix.png')}
                alt="OrthoBelt root cause fix"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="space-y-1.5">
              {['SI Joint ✓', 'Stabilization ✓', 'OrthoBelt ✓'].map((t) => (
                <div key={t} className="text-green-700 text-xs font-medium bg-green-100 rounded-md px-2 py-1">
                  {t}
                </div>
              ))}
            </div>
            <p className="text-green-600 text-xs mt-2 font-medium">Addresses root cause</p>
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-stone-800 rounded-2xl p-5 mb-8 text-center">
          <p className="text-white text-base leading-relaxed">
            If you want to <strong className="text-amber-400">actually fix </strong> your back pain,
            you need to stabilise the SI joint — and that&#39;s exactly what the{' '}
            <strong className="text-amber-400">OrthoBelt</strong> was designed to do.
          </p>
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
            Continue →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
