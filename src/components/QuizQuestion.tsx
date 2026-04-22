'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionConfig, QuestionOption } from '@/lib/types';
import { withBasePath } from '@/lib/withBasePath';
import BodyDiagram from './BodyDiagram';

interface QuizQuestionProps {
  config: QuestionConfig;
  currentAnswer?: string | string[];
  onAnswer: (value: string | string[]) => void;
}

function CheckBadge() {
  return (
    <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow z-10">
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── Square photo card — Spartan-style ───────────────────────────────────────
function PhotoCard({ option, isSelected, onClick }: { option: QuestionOption; isSelected: boolean; onClick: () => void }) {
  return (
    // Outer div enforces square aspect ratio from the grid column width
    <div style={{ aspectRatio: '1 / 1' }} className="relative w-full">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className={`absolute inset-0 overflow-hidden rounded-2xl border-2 transition-all duration-150 cursor-pointer w-full h-full
          ${isSelected ? 'border-amber-500' : 'border-stone-200 hover:border-amber-300'}`}
      >
        {/* Image fills card */}
        <img
          src={withBasePath(option.image!)}
          alt={option.label}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Gradient — bottom 55% of card */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)' }} />
        {/* Selected amber overlay */}
        {isSelected && <div className="absolute inset-0 bg-amber-500/20" />}
        {/* Label at bottom */}
        <div className="absolute bottom-0 left-0 right-0 pb-3 px-2 text-center">
          <span className="text-white font-bold text-base leading-tight block drop-shadow">{option.label}</span>
          {option.sublabel && <span className="text-white/70 text-xs block">{option.sublabel}</span>}
        </div>
        {isSelected && <CheckBadge />}
      </motion.button>
    </div>
  );
}

// ── Square body-diagram card ────────────────────────────────────────────────
function BodyCard({ option, isSelected, onClick }: { option: QuestionOption; isSelected: boolean; onClick: () => void }) {
  const hasSublabel = Boolean(option.sublabel);

  return (
    <div style={{ aspectRatio: '1 / 1' }} className="relative w-full">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className={`absolute inset-0 overflow-hidden rounded-2xl border-2 transition-all duration-150 cursor-pointer w-full h-full grid grid-rows-[3fr_1fr] px-2 pt-2 pb-2
          ${isSelected ? 'border-amber-500 bg-amber-50' : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/40'}`}
      >
        <div className="min-h-0 w-full flex items-center justify-center overflow-hidden">
          <div className="w-3/5 h-full max-h-[140px]">
            <BodyDiagram area={option.bodyPart!} selected={isSelected} />
          </div>
        </div>
        <div className="min-h-0 h-full flex flex-col items-center justify-center text-center px-1 overflow-hidden leading-tight">
          <span
            className={`font-semibold ${hasSublabel ? 'text-[12px]' : 'text-[13px]'} leading-tight block ${isSelected ? 'text-amber-900' : 'text-stone-700'}`}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: hasSublabel ? 1 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {option.label}
          </span>
          {option.sublabel && (
            <span
              className="text-stone-400 text-[11px] block mt-0"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {option.sublabel}
            </span>
          )}
        </div>
        {isSelected && <CheckBadge />}
      </motion.button>
    </div>
  );
}

// ── Square emoji card ────────────────────────────────────────────────────────
function EmojiCard({ option, isSelected, onClick }: { option: QuestionOption; isSelected: boolean; onClick: () => void }) {
  return (
    <div style={{ aspectRatio: '1 / 1' }} className="relative w-full">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className={`absolute inset-0 overflow-hidden rounded-2xl border-2 transition-all duration-150 cursor-pointer w-full h-full flex flex-col items-center justify-center gap-1.5 px-3
          ${isSelected ? 'border-amber-500' : 'border-stone-200 hover:border-amber-300'}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${option.bg ?? 'from-stone-100 to-stone-50'}`} />
        <span className="relative text-4xl">{option.emoji}</span>
        <div className="relative text-center">
          <span className={`font-bold text-sm block leading-tight ${isSelected ? 'text-amber-900' : 'text-stone-800'}`}>{option.label}</span>
          {option.sublabel && <span className="text-stone-500 text-xs block leading-snug mt-0.5">{option.sublabel}</span>}
        </div>
        {isSelected && <CheckBadge />}
      </motion.button>
    </div>
  );
}

// ── List item (default, multi-select, Q3 yes/no) ────────────────────────────
function ListItem({ option, isSelected, isMulti, onClick, index }: {
  option: QuestionOption; isSelected: boolean; isMulti: boolean; onClick: () => void; index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.22 }}
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-base transition-all duration-150 cursor-pointer
        ${isSelected ? 'bg-amber-50 border-amber-500 text-amber-900' : 'bg-white border-stone-200 text-stone-700 hover:border-amber-300 hover:bg-amber-50/40'}`}
    >
      <div className="flex items-center gap-3">
        <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center border-2 transition-colors
          ${isMulti ? 'rounded' : 'rounded-full'}
          ${isSelected ? 'bg-amber-500 border-amber-500' : 'border-stone-300'}`}>
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

// ── Main ────────────────────────────────────────────────────────────────────
export default function QuizQuestion({ config, currentAnswer, onAnswer }: QuizQuestionProps) {
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(currentAnswer) ? currentAnswer : currentAnswer ? [currentAnswer] : []
  );

  const handleSingle = (value: string) => onAnswer(value);
  const handleMultiToggle = (value: string) =>
    setSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);

  const isGrid = config.layout === 'grid';
  const hasPhotos = config.options.some(o => o.image);
  const hasBodyParts = config.options.some(o => o.bodyPart);
  const hasEmoji = config.options.some(o => o.emoji);

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-8 max-md:pb-[100px]">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-stone-800 text-center mb-6 leading-snug"
      >
        {config.question}
      </motion.h2>

      {isGrid && (hasPhotos || hasBodyParts || hasEmoji) ? (
        <div className="grid grid-cols-2 gap-3">
          {config.options.map((option, i) => {
            const isSelected = config.multiSelect ? selected.includes(option.value) : currentAnswer === option.value;
            const isLastOdd = config.options.length % 2 !== 0 && i === config.options.length - 1;
            const handleClick = () => config.multiSelect ? handleMultiToggle(option.value) : handleSingle(option.value);

            const cardClass = isLastOdd ? 'col-span-2' : '';

            return (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.22 }}
                className={cardClass}
                // Keep the final odd card centered without letting the grid item collapse.
                style={isLastOdd ? { width: 'calc(50% - 6px)', margin: '0 auto' } : {}}
              >
                {option.image && <PhotoCard option={option} isSelected={isSelected} onClick={handleClick} />}
                {option.bodyPart && <BodyCard option={option} isSelected={isSelected} onClick={handleClick} />}
                {option.emoji && <EmojiCard option={option} isSelected={isSelected} onClick={handleClick} />}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {config.options.map((option, i) => {
            const isSelected = config.multiSelect ? selected.includes(option.value) : currentAnswer === option.value;
            return (
              <ListItem
                key={option.value}
                option={option}
                isSelected={isSelected}
                isMulti={!!config.multiSelect}
                onClick={() => config.multiSelect ? handleMultiToggle(option.value) : handleSingle(option.value)}
                index={i}
              />
            );
          })}
        </div>
      )}

      {config.multiSelect && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-sm border-t border-stone-200 px-6 py-3 md:static md:bg-transparent md:border-0 md:p-0 md:mt-5"
        >
          <motion.button
            animate={{ opacity: selected.length > 0 ? 1 : 0.4 }}
            onClick={() => selected.length > 0 && onAnswer(selected)}
            disabled={selected.length === 0}
            className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg tracking-wide transition-colors duration-200 disabled:opacity-40"
          >
            Continue →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
