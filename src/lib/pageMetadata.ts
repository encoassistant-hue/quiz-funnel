import type { Metadata } from 'next';
import { getQuizContent } from './quizData';
import { LocalizationLocale } from './types';

export const sharedMetadata: Metadata = {
  title: 'Back Pain Quiz',
  description:
    'Take the free 60-second quiz to learn whether SI joint dysfunction may be contributing to your back pain.',
};

export function getQuizMetadata(locale: LocalizationLocale): Metadata {
  const { brand } = getQuizContent(locale);

  if (locale === 'de-DE') {
    return {
      title: `${brand.productName} — Finden Sie heraus, ob das ISG Ihre Rückenschmerzen verursacht`,
      description:
        `Machen Sie das kostenlose 60-Sekunden-Quiz, um die Ursache Ihrer Rückenschmerzen zu entdecken und einen exklusiven Rabatt auf ${brand.productName} freizuschalten.`,
    };
  }

  return {
    title: `${brand.productName} — Find Out If the SI Joint Is Causing Your Back Pain`,
    description: `Take the free 60-second quiz to discover the root cause of your back pain and unlock an exclusive discount on ${brand.productName}.`,
  };
}
