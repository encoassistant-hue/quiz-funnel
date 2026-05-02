import { Suspense } from 'react';
import QuizFunnelEntry from '@/components/QuizFunnelEntry';
import { LOCALIZATIONS } from '@/lib/localization';
import { getQuizMetadata } from '@/lib/pageMetadata';

export const metadata = getQuizMetadata(LOCALIZATIONS['orthogurtel-de'].locale);

export default function OrthogurtelDePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
      <QuizFunnelEntry localization={LOCALIZATIONS['orthogurtel-de']} />
    </Suspense>
  );
}
