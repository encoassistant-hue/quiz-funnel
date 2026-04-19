'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionConfig, QuestionOption } from '@/lib/types';
import BodyDiagram from './BodyDiagram';

interface QuizQuestionProps {
  config: QuestionConfig;
  currentAnswer?: string | string[];
  onAnswer: (value: string | string[]) => void;
}

function CheckBadge() {
  return (
    <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-md z-10">
      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 12 12">
        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── Photo card (Q1 age) ─────────────────────────────────────────────────────
function PhotoCard({
  option,
  isSelected,
  onClick,
}: {
  option: QuestionOption;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{ aspectRatio: '3/4' }}
      className={`relative overflow-hidden rounded-2xl w-full bg-stone-300 border-2 transition-all duration-200 cursor-pointer block
        ${isSelected ? 'border-amber-500 ring-2 ring-amber-300' : 'border-transparent'}`}
    >
      {/* Photo */}
      <img
        src={option.image}
        alt={option.label}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      {/* Selected tint */}
      {isSelected && <div className="absolute inset-0 bg-amber-500/25" />}
      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
        <span className="text-white font-bold text-lg leading-tight block">{option.label}</span>
        {option.sublabel && (
          <span className="text-white/75 text-xs block">{option.sublabel}</span>
        )}
      </div>
      {isSelected && <CheckBadge />}
    </motion.button>
  );
}

// ── Body diagram card (Q2 pain location) ───────────────────────────────────
function BodyCard({
  option,
  isSelected,
  onClick,
  isOdd,
}: {
  option: QuestionOption;
  isSelected: boolean;
  onClick: () => void;
  isOdd: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center pt-3 pb-3 px-2
        ${isOdd ? 'col-span-2' : ''}
        ${isSelected
          ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300'
          : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/40'
        }`}
    >
      <div className={`w-full flex items-center justify-center ${isOdd ? 'h-28' : 'h-32'}`}>
        <BodyDiagram area={option.bodyPart!} selected={isSelected} />
      </div>
      <span className={`font-semibold text-sm text-center leading-tight mt-1
        ${isSelected ? 'text-amber-900' : 'text-stone-700'}`}>
        {option.label}
      </span>
      {option.sublabel && (
        <span className="text-stone-400 text-xs text-center">{option.sublabel}</span>
      )}
      {isSelected && <CheckBadge />}
    </motion.button>
  );
}

// ── Emoji icon card (Q4, Q7, Q8) ───────────────────────────────────────────
function EmojiCard({
  option,
  isSelected,
  onClick,
}: {
  option: QuestionOption;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center py-5 px-3 gap-2
        ${isSelected
          ? 'border-amber-500 ring-2 ring-amber-300'
          : 'border-stone-200 hover:border-amber-300'
        }`}
    >
      {/* Gradient bg */}
      <div className={`absolute inset-0 bg-gradient-to-b ${option.bg ?? 'from-stone-100 to-stone-50'} opacity-80`} />
      <span className="relative text-4xl">{option.emoji}</span>
      <div className="relative text-center">
        <span className={`font-bold text-sm block ${isSelected ? 'text-amber-900' : 'text-stone-800'}`}>
          {option.label}
        </span>
        {option.sublabel && (
          <span className="text-stone-500 text-xs block leading-snug mt-0.5">{option.sublabel}</span>
        )}
      </div>
      {isSelected && <CheckBadge />}
    </motion.button>
  );
}

// ── List item (default) ─────────────────────────────────────────────────────
function ListItem({
  option,
  isSelected,
  isMulti,
  onClick,
  index,
}: {
  option: QuestionOption;
  isSelected: boolean;
  isMulti: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.22 }}
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-base transition-all duration-150 cursor-pointer
        ${isSelected
          ? 'bg-amber-50 border-amber-500 text-amber-900'
          : 'bg-white border-stone-200 text-stone-700 hover:border-amber-300 hover:bg-amber-50/40'
        }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-colors border-2
            ${isMulti ? 'rounded' : 'rounded-full'}
            ${isSelected ? 'bg-amber-500 border-amber-500' : 'border-stone-300'}`}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        {option.label}
      </div>
    </motion.button>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function QuizQuestion({ config, currentAnswer, onAnswer }: QuizQuestionProps) {
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(currentAnswer) ? currentAnswer : currentAnswer ? [currentAnswer] : []
  );

  function handleSingle(value: string) {
    onAnswer(value);
  }

  function handleMultiToggle(value: string) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  const isGrid = config.layout === 'grid';
  const hasPhotos = config.options.some((o) => o.image);
  const hasBodyParts = config.options.some((o) => o.bodyPart);
  const hasEmoji = config.options.some((o) => o.emoji);

  return (
    <div className="w-full max-w-xl mx-auto px-5 py-8">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-6 leading-snug"
      >
        {config.question}
      </motion.h2>

      {/* ── Grid layouts ── */}
      {isGrid && (hasPhotos || hasBodyParts || hasEmoji) ? (
        <div className="grid grid-cols-2 gap-3">
          {config.options.map((option, i) => {
            const isSelected = config.multiSelect
              ? selected.includes(option.value)
              : currentAnswer === option.value;
            const isLastOdd = config.options.length % 2 !== 0 && i === config.options.length - 1;

            const handleClick = () =>
              config.multiSelect ? handleMultiToggle(option.value) : handleSingle(option.value);

            if (option.image) {
              return (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                >
                  <PhotoCard option={option} isSelected={isSelected} onClick={handleClick} />
                </motion.div>
              );
            }

            if (option.bodyPart) {
              return (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  className={isLastOdd ? 'col-span-2' : ''}
                >
                  <BodyCard
                    option={option}
                    isSelected={isSelected}
                    onClick={handleClick}
                    isOdd={false}
                  />
                </motion.div>
              );
            }

            if (option.emoji) {
              return (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  className={isLastOdd ? 'col-span-2' : ''}
                >
                  <EmojiCard option={option} isSelected={isSelected} onClick={handleClick} />
                </motion.div>
              );
            }

            return null;
          })}
        </div>
      ) : (
        /* ── List layout (default) ── */
        <div className="flex flex-col gap-3">
          {config.options.map((option, i) => {
            const isSelected = config.multiSelect
              ? selected.includes(option.value)
              : currentAnswer === option.value;
            return (
              <ListItem
                key={option.value}
                option={option}
                isSelected={isSelected}
                isMulti={!!config.multiSelect}
                onClick={() =>
                  config.multiSelect ? handleMultiToggle(option.value) : handleSingle(option.value)
                }
                index={i}
              />
            );
          })}
        </div>
      )}

      {/* Continue button for multi-select */}
      {config.multiSelect && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: selected.length > 0 ? 1 : 0.4 }}
          onClick={() => selected.length > 0 && onAnswer(selected)}
          disabled={selected.length === 0}
          className="mt-6 w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg tracking-wide transition-colors duration-200 disabled:opacity-40"
        >
          Continue →
        </motion.button>
      )}
    </div>
  );
}
