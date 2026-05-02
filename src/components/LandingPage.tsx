'use client';

import { motion } from 'framer-motion';
import { BrandContent, LandingPageContent } from '@/lib/quizData';

interface LandingPageProps {
  onGenderSelect: (gender: string) => void;
  content: LandingPageContent;
  brand: BrandContent;
}

export default function LandingPage({ onGenderSelect, content, brand }: LandingPageProps) {
  return (
    <div className="relative min-h-screen w-full self-stretch overflow-y-auto flex flex-col items-center justify-center overflow-x-hidden bg-gray-950 pb-16 md:pb-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl mx-auto px-6 py-16 text-center"
      >
        <div className="mb-10">
          <span className="text-white text-2xl font-bold tracking-widest uppercase">
            {brand.productNameParts[0]}<span className="text-amber-400">{brand.productNameParts[1]}</span>
          </span>
        </div>

        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
          <span className="text-amber-400 text-sm">★★★★★</span>
          <span className="text-white/90 text-sm font-medium">{content.ratingText}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          {content.headlineStart}
          <br />
          <span className="text-amber-400">{content.headlineHighlight}</span>
        </h1>

        <p className="text-white/70 text-lg mb-8 leading-relaxed">{content.subheadline}</p>

        <ul className="text-left inline-flex flex-col gap-3 mb-10">
          {content.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-white/90 text-base">{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 mb-10 text-left">
          <p className="text-white/85 text-sm italic leading-relaxed mb-3">&quot;{content.testimonialQuote}&quot;</p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-400/30 flex items-center justify-center text-amber-300 text-xs font-bold">
              M
            </div>
            <span className="text-white/60 text-xs">{content.testimonialAuthor}</span>
          </div>
        </div>

        <div className="hidden md:block">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-4">{content.ctaLabel}</p>
          <div className="flex gap-4 justify-center">
            {content.genderOptions.map((gender) => (
              <motion.button
                key={gender.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onGenderSelect(gender.value)}
                className="flex-1 max-w-[180px] py-4 rounded-xl font-bold text-lg tracking-wide border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-colors duration-200"
              >
                {gender.icon} {gender.label.toUpperCase()}
              </motion.button>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-4">{content.freeDisclaimer}</p>
        </div>

        <p className="text-white/40 text-xs md:hidden">{content.freeDisclaimer}</p>
      </motion.div>
    </div>
  );
}
