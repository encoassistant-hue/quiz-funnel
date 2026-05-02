import { Suspense } from 'react';
import QuizFunnelEntry from '@/components/QuizFunnelEntry';
import { DEFAULT_LOCALIZATION } from '@/lib/localization';
import { getQuizMetadata } from '@/lib/pageMetadata';

export const metadata = getQuizMetadata(DEFAULT_LOCALIZATION.locale);

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
      <QuizFunnelEntry localization={DEFAULT_LOCALIZATION} />
    </Suspense>
  );
}
