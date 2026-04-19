'use client';

import { motion } from 'framer-motion';

interface EducationSlideProps {
  onContinue: () => void;
}

export default function EducationSlide({ onContinue }: EducationSlideProps) {
  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10">
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
            <strong className="text-stone-900">don't work long-term</strong> because they don't
            address the SI joint — the <strong className="text-amber-700">real source</strong> of
            your pain.
          </p>
        </div>

        {/* Side-by-side illustration */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Left: pain */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <div className="w-full rounded-lg overflow-hidden mb-3">
              <img
                src="https://v3b.fal.media/files/b/0a96de65/5V--_jkfxAjF0BxN_3_Jn_rLSGbo2B.png"
                alt="Treatments that don't work"
                className="w-full object-cover"
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
            <div className="w-full rounded-lg overflow-hidden mb-3">
              <img
                src="https://v3b.fal.media/files/b/0a96de65/gbBHK6jRYyyoBKYvlCXF6_FtZctKyz.png"
                alt="OrthoBelt root cause fix"
                className="w-full object-cover"
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
            If you want to <strong className="text-amber-400">actually fix</strong> your back pain,
            you need to stabilize the SI joint — and that's exactly what the{' '}
            <strong className="text-amber-400">OrthoBelt</strong> was designed to do.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg tracking-wide transition-colors duration-200"
        >
          Continue →
        </motion.button>
      </motion.div>
    </div>
  );
}
