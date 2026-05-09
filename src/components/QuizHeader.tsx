'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Screen } from '@/lib/types';
import {getProgressPercent, QUIZ_SCREENS} from '@/lib/quizData';

interface QuizHeaderProps {
  screen: Screen;
}

export default function QuizHeader({ screen }: QuizHeaderProps) {
  const percent = getProgressPercent(screen);
  const showProgress = QUIZ_SCREENS.includes(screen);

  return (
    <div className="w-full">
      {/* Logo bar */}
      <div className="flex items-center justify-center py-3 px-6">
        <Image src="/orthotal-logo.png" alt="Orthotal" width={160} height={40} priority />
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
