'use client';

import { motion } from 'framer-motion';
import { Screen } from '@/lib/types';
import {BrandContent, getProgressPercent, QUIZ_SCREENS} from '@/lib/quizData';

interface QuizHeaderProps {
  screen: Screen;
  brand: BrandContent;
}

export default function QuizHeader({ screen, brand }: QuizHeaderProps) {
  const percent = getProgressPercent(screen);
  const showProgress = QUIZ_SCREENS.includes(screen);

  return (
    <div className="w-full">
      {/* Logo bar */}
      <div className="flex items-center justify-center py-5 px-6">
        <span className="text-stone-800 text-xl font-bold tracking-widest uppercase">
            {brand.productNameParts[0]}<span className="text-amber-600">{brand.productNameParts[1]}</span>        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-stone-200">
        <motion.div
          className="h-full bg-amber-500 rounded-r-full"
          initial={false}
          animate={{ width: showProgress ? `${percent}%` : '0%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
