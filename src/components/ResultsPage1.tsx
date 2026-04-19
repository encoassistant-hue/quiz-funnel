'use client';

import { motion } from 'framer-motion';

interface ResultsPage1Props {
  onContinue: () => void;
}

export default function ResultsPage1({ onContinue }: ResultsPage1Props) {
  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-amber-600 uppercase tracking-widest text-xs font-semibold mb-2">
            Your assessment is ready
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-1">
            Summary of your Back Pain Profile
          </h2>
          <p className="text-stone-500 text-sm">Based on your answers</p>
        </div>

        {/* Dysfunction Level Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-stone-600 font-medium text-sm">Level of SI joint dysfunction</span>
            <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">
              HIGH
            </span>
          </div>

          {/* SI Joint illustration */}
          <div className="w-full rounded-xl overflow-hidden mb-5">
            <img
              src="https://v3b.fal.media/files/b/0a96de65/3us_l1d3H4RyCRr28HXsw_fmP4kHew.png"
              alt="SI Joint inflammation"
              className="w-full object-cover"
            />
          </div>

          {/* Slider scale */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-stone-400 mb-1">
              <span>Low</span>
              <span>Normal</span>
              <span>Medium</span>
              <span className="font-bold text-red-500">High ◀</span>
            </div>
            <div className="h-3 rounded-full bg-gradient-to-r from-green-300 via-yellow-300 via-orange-400 to-red-500 relative">
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

        {/* Warning box */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <p className="text-red-800 text-sm leading-relaxed">
            <strong>HIGH level.</strong> Your symptoms suggest significant SI joint instability.
            This is likely caused by prolonged sitting, repetitive movement, and lack of targeted
            joint support.
          </p>
        </div>

        {/* Data table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-4 py-3 text-stone-500 font-semibold">Metric</th>
                <th className="text-right px-4 py-3 text-stone-500 font-semibold">Assessment</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Root cause', value: 'SI joint dysfunction', highlight: true },
                { label: 'Room for improvement', value: 'High', highlight: true },
                { label: 'Impact on daily life', value: 'Noticeable', highlight: false },
              ].map((row, i) => (
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
