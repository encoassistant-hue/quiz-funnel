import { LocalizationLocale, QuestionConfig, Screen } from './types';

export type LandingPageContent = {
  ratingText: string;
  headlineStart: string;
  headlineHighlight: string;
  subheadline: string;
  benefits: string[];
  testimonialQuote: string;
  testimonialAuthor: string;
  ctaLabel: string;
  freeDisclaimer: string;
  genderOptions: Array<{ value: string; label: string; icon: string }>;
};

export type ResultsPage1Content = {
  badge: string;
  title: string;
  subtitle: string;
  severityLabel: string;
  severityValue: string;
  scaleLabels: [string, string, string, string];
  warningTitle: string;
  warningBody: string;
  inflamedImage: string;
  tableHeaders: [string, string];
  metrics: Array<{ label: string; value: string; highlight: boolean }>;
  continueLabel: string;
};

export type EducationSlideContent = {
  badge: string;
  title: string;
  insight: string;
  symptomTags: string[];
  symptomFooter: string;
  solutionTags: string[];
  solutionFooter: string;
  conclusion: string;
  continueLabel: string;
};

export type ResultsPage2Content = {
  badge: string;
  titleStart: string;
  titleHighlight: string;
  titleEnd: string;
  checklist: [string, string];
  nowLabel: string;
  nowSubLabel: string;
  goalLabel: string;
  goalSubLabel: string;
  comparisonHeaders: [string, string, string];
  comparisonRows: Array<{ metric: string; now: string; goal: string }>;
  inflamedImage: string;
  stabilizedImage: string;
  offerText: string;
  ctaLabel: string;
  guaranteeText: string;
};

export type BrandContent = {
  productName: string;
  productNameParts: [string, string];
};

export type QuizContent = {
  brand: BrandContent;
  questions: QuestionConfig[];
  multiSelectContinueLabel: string;
  landing: LandingPageContent;
  results1: ResultsPage1Content;
  education: EducationSlideContent;
  results2: ResultsPage2Content;
};

const ENGLISH_PRODUCT_NAME = 'OrthoBelt';
const ENGLISH_PRODUCT_NAME_PARTS: [string, string] = ['Ortho', 'Belt'];
const GERMAN_PRODUCT_NAME = 'Orthogürtel';
const GERMAN_PRODUCT_NAME_PARTS: [string, string] = ['Ortho', 'gürtel'];

const ENGLISH_QUESTIONS: QuestionConfig[] = [
  {
    id: 'q1',
    screen: 'q1',
    layout: 'grid',
    question: 'How old are you?',
    options: [
      { value: '<39', label: '30–39', sublabel: 'Years Old', image: '/quiz/20_29.png' },
      { value: '40-49', label: '40–49', sublabel: 'Years Old', image: '/quiz/30_39.png' },
      { value: '50-59', label: '50-59', sublabel: 'Years Old', image: '/quiz/40_49.png' },
      { value: '60+', label: '60+', sublabel: 'Years Old', image: '/quiz/50_plus.png' },
    ],
  },
  {
    id: 'q2',
    screen: 'q2',
    layout: 'grid',
    question: 'Where do you feel your pain most?',
    options: [
      { value: 'lower-back', label: 'Lower back', bodyPart: 'lower-back' },
      { value: 'hip-buttock', label: 'Hip or buttock', bodyPart: 'hip-buttock' },
      { value: 'sciatica', label: 'Shooting down leg', sublabel: '(sciatica)', bodyPart: 'sciatica' },
      { value: 'everything', label: 'A bit of everything', bodyPart: 'everything' },
      { value: 'not-sure', label: "I'm not sure", sublabel: 'it moves around', bodyPart: 'not-sure' },
    ],
  },
  {
    id: 'q3',
    screen: 'q3',
    question: 'Do you experience stiffness or pain that is worse in the morning or after sitting for a long time?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 'q4',
    screen: 'q4',
    layout: 'grid',
    question: 'How much does your back pain affect your daily life?',
    options: [
      { value: 'a-lot', label: 'A lot', sublabel: 'I have had to stop activities I used to enjoy', emoji: '😣', bg: 'from-red-100 to-red-50' },
      { value: 'some', label: 'Some', sublabel: 'I push through, but it is always there', emoji: '😤', bg: 'from-amber-100 to-amber-50' },
      { value: 'a-little', label: 'A little', sublabel: 'It comes and goes', emoji: '😌', bg: 'from-green-100 to-green-50' },
    ],
  },
  {
    id: 'q5',
    screen: 'q5',
    question: 'How long have you been dealing with this pain?',
    options: [
      { value: 'over-year', label: 'Over a year' },
      { value: 'past-year', label: 'In the past year' },
      { value: 'past-months', label: 'In the past few months' },
      { value: 'not-sure', label: 'Not sure' },
    ],
  },
  {
    id: 'q6',
    screen: 'q6',
    question: 'What solutions have you tried before? (Choose all that apply)',
    multiSelect: true,
    options: [
      { value: 'medication', label: 'Pain medication / anti-inflammatories' },
      { value: 'stretching', label: 'Stretching / yoga' },
      { value: 'physio', label: 'Physiotherapy' },
      { value: 'cortisone', label: 'Cortisone injections' },
      { value: 'ergonomic', label: 'Ergonomic chair / standing desk' },
      { value: 'back-brace', label: `Back brace` },
      { value: 'others', label: 'Others' },
      { value: 'nothing', label: 'Nothing yet' },
    ],
  },
  {
    id: 'q7',
    screen: 'q7',
    layout: 'grid',
    question: 'What is your biggest concern if your back pain continues unchanged?',
    options: [
      { value: 'mobility', label: 'Losing mobility', sublabel: 'It will get worse over time', emoji: '🦽', bg: 'from-red-100 to-orange-50' },
      { value: 'activities', label: 'Giving up activities', sublabel: 'Things I love, permanently', emoji: '⛔', bg: 'from-orange-100 to-amber-50' },
      { value: 'money', label: 'Wasting money', sublabel: 'On treatments that do not work', emoji: '💸', bg: 'from-yellow-100 to-yellow-50' },
      { value: 'surgery', label: 'Needing surgery', sublabel: 'As a last resort', emoji: '🏥', bg: 'from-purple-100 to-purple-50' },
    ],
  },
  {
    id: 'q8',
    screen: 'q8',
    layout: 'grid',
    question: 'How motivated are you to fix your back pain?',
    options: [
      { value: 'extremely', label: 'Extremely', sublabel: 'I need this fixed now', emoji: '🔥', bg: 'from-amber-100 to-orange-50' },
      { value: 'very', label: 'Very motivated', sublabel: 'Ready to try something new', emoji: '💪', bg: 'from-green-100 to-emerald-50' },
      { value: 'somewhat', label: 'Somewhat', sublabel: 'I have been let down before', emoji: '🤞', bg: 'from-blue-100 to-sky-50' },
      { value: 'depends', label: 'It depends', sublabel: 'On the solution', emoji: '🤔', bg: 'from-stone-100 to-stone-50' },
    ],
  },
];

const GERMAN_QUESTIONS: QuestionConfig[] = [
  {
    id: 'q1',
    screen: 'q1',
    layout: 'grid',
    question: 'Wie alt sind Sie?',
    options: [
      { value: '<39', label: '30–39', sublabel: 'Jahre alt', image: '/quiz/20_29.png' },
      { value: '40-49', label: '40–49', sublabel: 'Jahre alt', image: '/quiz/30_39.png' },
      { value: '50-59', label: '50-59', sublabel: 'Jahre alt', image: '/quiz/40_49.png' },
      { value: '60+', label: '60+', sublabel: 'Jahre alt', image: '/quiz/50_plus.png' },
    ],
  },
  {
    id: 'q2',
    screen: 'q2',
    layout: 'grid',
    question: 'Wo spüren Sie Ihre Schmerzen am stärksten?',
    options: [
      { value: 'lower-back', label: 'Unterer Rücken', bodyPart: 'lower-back' },
      { value: 'hip-buttock', label: 'Hüfte oder Gesäß', bodyPart: 'hip-buttock' },
      { value: 'sciatica', label: 'Ausstrahlung ins Bein', sublabel: '(Ischias)', bodyPart: 'sciatica' },
      { value: 'everything', label: 'Von allem etwas', bodyPart: 'everything' },
      { value: 'not-sure', label: 'Ich bin nicht sicher', sublabel: 'es wandert', bodyPart: 'not-sure' },
    ],
  },
  {
    id: 'q3',
    screen: 'q3',
    question: 'Haben Sie Steifheit oder Schmerzen, die morgens oder nach langem Sitzen schlimmer sind?',
    options: [
      { value: 'yes', label: 'Ja' },
      { value: 'no', label: 'Nein' },
    ],
  },
  {
    id: 'q4',
    screen: 'q4',
    layout: 'grid',
    question: 'Wie stark beeinflussen Ihre Rückenschmerzen Ihren Alltag?',
    options: [
      { value: 'a-lot', label: 'Stark', sublabel: 'Ich musste auf Dinge verzichten, die ich gern gemacht habe', emoji: '😣', bg: 'from-red-100 to-red-50' },
      { value: 'some', label: 'Teilweise', sublabel: 'Ich mache weiter, aber es ist immer da', emoji: '😤', bg: 'from-amber-100 to-amber-50' },
      { value: 'a-little', label: 'Ein wenig', sublabel: 'Es kommt und geht', emoji: '😌', bg: 'from-green-100 to-green-50' },
    ],
  },
  {
    id: 'q5',
    screen: 'q5',
    question: 'Wie lange haben Sie diese Schmerzen schon?',
    options: [
      { value: 'over-year', label: 'Über ein Jahr' },
      { value: 'past-year', label: 'Im letzten Jahr' },
      { value: 'past-months', label: 'Seit einigen Monaten' },
      { value: 'not-sure', label: 'Nicht sicher' },
    ],
  },
  {
    id: 'q6',
    screen: 'q6',
    question: 'Welche Lösungen haben Sie schon ausprobiert? (Mehrfachauswahl moglich)',
    multiSelect: true,
    options: [
      { value: 'medication', label: 'Schmerzmittel / Entzündungshemmer' },
      { value: 'stretching', label: 'Dehnen / Yoga' },
      { value: 'physio', label: 'Physiotherapie' },
      { value: 'cortisone', label: 'Kortison-Injektionen' },
      { value: 'ergonomic', label: 'Ergonomischer Stuhl / Stehschreibtisch' },
      { value: 'back-brace', label: `Rückenbandage` },
      { value: 'others', label: 'Sonstiges' },
      { value: 'nothing', label: 'Noch nichts' },
    ],
  },
  {
    id: 'q7',
    screen: 'q7',
    layout: 'grid',
    question: 'Was ist Ihre größte Sorge, wenn sich Ihre Rückenschmerzen nicht verändern?',
    options: [
      { value: 'mobility', label: 'Beweglichkeit verlieren', sublabel: 'Es wird mit der Zeit schlimmer', emoji: '🦽', bg: 'from-red-100 to-orange-50' },
      { value: 'activities', label: 'Auf Aktivitäten verzichten', sublabel: 'Auf Dinge, die ich liebe, dauerhaft', emoji: '⛔', bg: 'from-orange-100 to-amber-50' },
      { value: 'money', label: 'Geld verschwenden', sublabel: 'Fur Behandlungen, die nicht helfen', emoji: '💸', bg: 'from-yellow-100 to-yellow-50' },
      { value: 'surgery', label: 'Eine Operation brauchen', sublabel: 'Als letzten Ausweg', emoji: '🏥', bg: 'from-purple-100 to-purple-50' },
    ],
  },
  {
    id: 'q8',
    screen: 'q8',
    layout: 'grid',
    question: 'Wie motiviert sind Sie, Ihre Rückenschmerzen zu lösen?',
    options: [
      { value: 'extremely', label: 'Maximal', sublabel: 'Ich brauche jetzt eine Lösung', emoji: '🔥', bg: 'from-amber-100 to-orange-50' },
      { value: 'very', label: 'Sehr motiviert', sublabel: 'Bereit, etwas Neues zu versuchen', emoji: '💪', bg: 'from-green-100 to-emerald-50' },
      { value: 'somewhat', label: 'Einigermaßen', sublabel: 'Ich wurde schon oft enttäuscht', emoji: '🤞', bg: 'from-blue-100 to-sky-50' },
      { value: 'depends', label: 'Kommt darauf an', sublabel: 'Auf die Lösung', emoji: '🤔', bg: 'from-stone-100 to-stone-50' },
    ],
  },
];

export const QUIZ_CONTENT_BY_LOCALE: Record<LocalizationLocale, QuizContent> = {
  'en-US': {
    brand: {
      productName: ENGLISH_PRODUCT_NAME,
      productNameParts: ENGLISH_PRODUCT_NAME_PARTS,
    },
    questions: ENGLISH_QUESTIONS,
    multiSelectContinueLabel: 'Continue ->',
    landing: {
      ratingText: '4.9 · Clinicians\' Choice 2024',
      headlineStart: 'Is Your Lower Back Pain',
      headlineHighlight: 'Caused by the SI Joint?',
      subheadline: 'Over 87% of chronic lower back pain cases are linked to SI joint dysfunction - and most people never get the right diagnosis.',
      benefits: [
        'Confirm the real root cause of your back pain',
        'Find out how fast you can experience relief',
        'Unlock a private 20% off discount if eligible',
      ],
      testimonialQuote: `After 2 years of physiotherapy and cortisone injections with no lasting relief, the ${ENGLISH_PRODUCT_NAME} gave me my life back in under 3 weeks.`,
      testimonialAuthor: 'Mark T., 52 - Verified Buyer',
      ctaLabel: 'Take the free 60-second quiz:',
      freeDisclaimer: '100% free · No credit card required · Results in 60 seconds',
      genderOptions: [
        { value: 'male', label: 'Male', icon: '♂' },
        { value: 'female', label: 'Female', icon: '♀' },
      ],
    },
    results1: {
      badge: 'Your assessment is ready',
      title: 'Summary of your Back Pain Profile',
      subtitle: 'Based on your answers',
      severityLabel: 'Level of SI joint dysfunction',
      severityValue: 'HIGH',
      scaleLabels: ['Low', 'Normal', 'Medium', 'High <'],
      warningTitle: 'HIGH level.',
      warningBody: 'Your symptoms suggest significant SI joint instability. This is likely caused by prolonged sitting, repetitive movement, and lack of targeted joint support.',
      inflamedImage: '/education/si-joint-inflamed.png',
      tableHeaders: ['Metric', 'Assessment'],
      metrics: [
        { label: 'Pain type', value: 'Nerve irritation', highlight: true },
        { label: 'Root cause', value: 'SI joint dysfunction', highlight: true },
        { label: 'Room for improvement', value: 'High', highlight: true },
        { label: 'Impact on daily life', value: 'Noticeable', highlight: false },
      ],
      continueLabel: 'Continue ->',
    },
    education: {
      badge: 'The truth about back pain',
      title: 'Why does nothing work on chronic back pain and sciatica?',
      insight: 'Stretching, physiotherapy, and pain medication do not work long-term because they do not address the SI joint - the real source of your pain.',
      symptomTags: ['Pain pills x', 'Stretching x', 'Physio x'],
      symptomFooter: 'Treats symptoms only',
      solutionTags: ['SI Joint check', 'Stabilization check', `${ENGLISH_PRODUCT_NAME} check`],
      solutionFooter: 'Addresses root cause',
      conclusion: `If you want to actually fix your back pain, you need to stabilize the SI joint - and that is exactly what the ${ENGLISH_PRODUCT_NAME} was designed to do.`,
      continueLabel: 'Continue ->',
    },
    results2: {
      badge: 'Results ready for you',
      titleStart: 'You Are Just',
      titleHighlight: '30 Days Away',
      titleEnd: 'From a Pain-Free Back!',
      checklist: [
        `First relief after just 1 day of wearing the ${ENGLISH_PRODUCT_NAME}.`,
        'Significant reduction in pain and improved mobility by {date}.',
      ],
      nowLabel: 'SI Joint NOW',
      nowSubLabel: 'Inflamed & Unstable',
      goalLabel: 'YOUR GOAL',
      goalSubLabel: 'Stabilized & Pain-Free',
      comparisonHeaders: ['Metric', 'Now', 'Your Goal'],
      comparisonRows: [
        { metric: 'SI Joint Stability', now: 'Unstable RED', goal: 'Stabilized GREEN' },
        { metric: 'Morning Stiffness', now: 'Severe RED', goal: 'Gone GREEN' },
        { metric: 'Daily Pain Level', now: 'High RED', goal: 'Minimal GREEN' },
      ],
      inflamedImage: '/education/si-joint-inflamed.png',
      stabilizedImage: '/education/si-joint-stabilized.png',
      offerText: 'Based on your answers, you qualify for an exclusive offer. This offer is reserved for quiz completers only.',
      ctaLabel: 'CLAIM YOUR DISCOUNT',
      guaranteeText: '30-day money-back guarantee · Free shipping · Ships within 24h',
    },
  },
  'de-DE': {
    brand: {
      productName: GERMAN_PRODUCT_NAME,
      productNameParts: GERMAN_PRODUCT_NAME_PARTS,
    },
    questions: GERMAN_QUESTIONS,
    multiSelectContinueLabel: 'Weiter ->',
    landing: {
      ratingText: '4.9 · Empfehlung von Fachpersonen 2024',
      headlineStart: 'Kommen Ihre Schmerzen im unteren Rucken',
      headlineHighlight: 'vom ISG?',
      subheadline: 'Uber 87% der chronischen Schmerzen im unteren Rucken hangen mit einer ISG-Fehlfunktion zusammen - und die meisten Menschen bekommen nie die richtige Diagnose.',
      benefits: [
        'Erkennen Sie die wahre Ursache Ihrer Ruckenschmerzen',
        'Finden Sie heraus, wie schnell Sie Erleichterung spuren konnen',
        'Sichern Sie sich 20% privaten Quiz-Rabatt, wenn Sie geeignet sind',
      ],
      testimonialQuote: `Nach 2 Jahren Physiotherapie und Kortison-Injektionen ohne nachhaltige Besserung hat mir der ${GERMAN_PRODUCT_NAME} mein Leben in weniger als 3 Wochen zuruckgegeben.`,
      testimonialAuthor: 'Mark T., 52 - Verifizierter Kaufer',
      ctaLabel: 'Machen Sie das kostenlose 60-Sekunden-Quiz:',
      freeDisclaimer: '100% kostenlos · Keine Kreditkarte erforderlich · Ergebnis in 60 Sekunden',
      genderOptions: [
        { value: 'male', label: 'Mannlich', icon: '♂' },
        { value: 'female', label: 'Weiblich', icon: '♀' },
      ],
    },
    results1: {
      badge: 'Ihre Auswertung ist bereit',
      title: 'Zusammenfassung Ihres Rückenschmerz-Profils',
      subtitle: 'Basierend auf Ihren Antworten',
      severityLabel: 'Grad der ISG-Blockade',
      severityValue: 'HOCH',
      scaleLabels: ['Niedrig', 'Normal', 'Mittel', 'Hoch <'],
      warningTitle: 'HOHES Niveau.',
      warningBody: 'Ihre Symptome deuten auf eine deutliche ISG-Instabilität hin. Das wird oft durch langes Sitzen, wiederholte Belastung und fehlende gezielte Gelenkstützung verursacht.',
      inflamedImage: '/education/si-joint-inflamed-de.png',
      tableHeaders: ['Metrik', 'Zusammenfassung'],
      metrics: [
        { label: 'Schmerztyp', value: 'Nervenreizung', highlight: true },
        { label: 'Ursache', value: 'ISG-Blockade', highlight: true },
        { label: 'Verbesserungspotenzial', value: 'Hoch', highlight: true },
        { label: 'Auswirkung auf den Alltag', value: 'Spürbar', highlight: false },
      ],
      continueLabel: 'Weiter ->',
    },
    education: {
      badge: 'Die Wahrheit uber Rückenschmerzen',
      title: 'Warum hilft bei chronischen Rückenschmerzen und Ischias nichts dauerhaft?',
      insight: 'Dehnen, Physiotherapie und Schmerzmittel wirken langfristig nicht, weil sie das ISG nicht behandeln - die eigentliche Ursache Ihrer Schmerzen.',
      symptomTags: ['Schmerzmittel x', 'Dehnen x', 'Physio x'],
      symptomFooter: 'Behandelt nur Symptome',
      solutionTags: ['ISG', 'Stabilisierung', `${GERMAN_PRODUCT_NAME}`],
      solutionFooter: 'Behebt die Ursache',
      conclusion: `Wenn Sie Ihre Rückenschmerzen wirklich lösen wollen, müssen Sie das ISG stabilisieren - genau dafür wurde der ${GERMAN_PRODUCT_NAME} entwickelt.`,
      continueLabel: 'Weiter ->',
    },
    results2: {
      badge: 'Ihr Ergebnis ist bereit',
      titleStart: 'Sie sind nur noch',
      titleHighlight: '30 Tage',
      titleEnd: 'von einem schmerzfreien Rücken entfernt!',
      checklist: [
        `Erste Erleichterung schon nach 1 Tag mit dem ${GERMAN_PRODUCT_NAME}.`,
        'Deutlich weniger Schmerzen und bessere Beweglichkeit bis zum {date}.',
      ],
      nowLabel: 'JETZT',
      nowSubLabel: 'Entzündet & Instabil',
      goalLabel: 'IHR ZIEL',
      goalSubLabel: 'Stabilisiert & Schmerzfrei',
      comparisonHeaders: ['Merkmal', 'Jetzt', 'Ihr Ziel'],
      comparisonRows: [
        { metric: 'ISG-Stabilität', now: 'Instabil', goal: 'Stabilisiert' },
        { metric: 'Morgensteifigkeit', now: 'Stark', goal: 'Verschwunden' },
        { metric: 'Tagliches Schmerzniveau', now: 'Hoch', goal: 'Minimal' },
      ],
      inflamedImage: '/education/si-joint-inflamed-de.png',
      stabilizedImage: '/education/si-joint-stabilized-de.png',
      offerText: 'Basierend auf Ihren Antworten qualifizieren Sie sich fur ein exklusives Angebot. Dieses Angebot ist nur fur Quiz-Teilnehmer reserviert.',
      ctaLabel: 'RABATT SICHERN',
      guaranteeText: '90 Tage Geld-zuruck-Garantie · Kostenloser Versand · Versand innerhalb von 24h',
    },
  },
};

export const SCREEN_ORDER: Screen[] = [
  'landing',
  'q1',
  'q2',
  'q3',
  'q4',
  'q5',
  'results1',
  'q6',
  'education',
  'q7',
  'q8',
  'results2',
];

export const QUIZ_SCREENS: Screen[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];

export function getQuizContent(locale: LocalizationLocale): QuizContent {
  return QUIZ_CONTENT_BY_LOCALE[locale];
}

export function getProgressPercent(screen: Screen): number {
  const idx = QUIZ_SCREENS.indexOf(screen);
  if (idx === -1) return 0;
  return ((idx + 1) / QUIZ_SCREENS.length) * 100;
}

export function getNextScreen(current: Screen, version: string): Screen {
  const order = version === 'b' ? SCREEN_ORDER : SCREEN_ORDER.filter((s) => s !== 'landing');
  const idx = order.indexOf(current);
  return order[idx + 1] ?? 'results2';
}
