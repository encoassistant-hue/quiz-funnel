import { QuestionConfig, Screen } from './types';

// Replace these with your own licensed photos for production
const UNSPLASH = 'https://images.unsplash.com';

export const QUESTIONS: QuestionConfig[] = [
  {
    id: 'q1',
    screen: 'q1',
    layout: 'grid',
    question: 'How old are you?',
    options: [
      {
        value: '20-29',
        label: '20–29',
        sublabel: 'Years Old',
        image: `${UNSPLASH}/photo-1571019613454-1cb2f99b2d8b?w=400&h=520&fit=crop&q=80`,
      },
      {
        value: '30-39',
        label: '30–39',
        sublabel: 'Years Old',
        image: `${UNSPLASH}/photo-1507003211169-0a1dd7228f2d?w=400&h=520&fit=crop&q=80`,
      },
      {
        value: '40-49',
        label: '40–49',
        sublabel: 'Years Old',
        image: `${UNSPLASH}/photo-1534528526-95d3fe7c0df6?w=400&h=520&fit=crop&q=80`,
      },
      {
        value: '50+',
        label: '50+',
        sublabel: 'Years Old',
        image: `${UNSPLASH}/photo-1559839734-2b71ea197ec2?w=400&h=520&fit=crop&q=80`,
      },
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
      { value: 'sciatica', label: 'Shooting down one leg', sublabel: '(sciatica)', bodyPart: 'sciatica' },
      { value: 'everything', label: 'A bit of everything', bodyPart: 'everything' },
      { value: 'not-sure', label: "I'm not sure", sublabel: 'it moves around', bodyPart: 'not-sure' },
    ],
  },
  {
    id: 'q3',
    screen: 'q3',
    question:
      "Do you experience stiffness or pain that\u2019s worse in the morning or after sitting for a long time?",
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
      {
        value: 'a-lot',
        label: 'A lot',
        sublabel: "I've had to stop activities I used to enjoy",
        emoji: '😣',
        bg: 'from-red-100 to-red-50',
      },
      {
        value: 'some',
        label: 'Some',
        sublabel: "I push through, but it's always there",
        emoji: '😤',
        bg: 'from-amber-100 to-amber-50',
      },
      {
        value: 'a-little',
        label: 'A little',
        sublabel: 'It comes and goes',
        emoji: '😌',
        bg: 'from-green-100 to-green-50',
      },
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
      { value: 'back-brace', label: 'Back brace or support belt' },
      { value: 'others', label: 'Others' },
      { value: 'nothing', label: 'Nothing yet' },
    ],
  },
  {
    id: 'q7',
    screen: 'q7',
    layout: 'grid',
    question: "What's your biggest concern if your back pain continues unchanged?",
    options: [
      {
        value: 'mobility',
        label: 'Losing mobility',
        sublabel: "It will get worse over time",
        emoji: '🦽',
        bg: 'from-red-100 to-orange-50',
      },
      {
        value: 'activities',
        label: 'Giving up activities',
        sublabel: "Things I love, permanently",
        emoji: '⛔',
        bg: 'from-orange-100 to-amber-50',
      },
      {
        value: 'money',
        label: 'Wasting money',
        sublabel: "On treatments that don't work",
        emoji: '💸',
        bg: 'from-yellow-100 to-yellow-50',
      },
      {
        value: 'surgery',
        label: 'Needing surgery',
        sublabel: "As a last resort",
        emoji: '🏥',
        bg: 'from-purple-100 to-purple-50',
      },
    ],
  },
  {
    id: 'q8',
    screen: 'q8',
    layout: 'grid',
    question: 'How motivated are you to fix your back pain?',
    options: [
      {
        value: 'extremely',
        label: 'Extremely',
        sublabel: 'I need this fixed now',
        emoji: '🔥',
        bg: 'from-amber-100 to-orange-50',
      },
      {
        value: 'very',
        label: 'Very motivated',
        sublabel: "Ready to try something new",
        emoji: '💪',
        bg: 'from-green-100 to-emerald-50',
      },
      {
        value: 'somewhat',
        label: 'Somewhat',
        sublabel: "I've been let down before",
        emoji: '🤞',
        bg: 'from-blue-100 to-sky-50',
      },
      {
        value: 'depends',
        label: 'It depends',
        sublabel: 'On the solution',
        emoji: '🤔',
        bg: 'from-stone-100 to-stone-50',
      },
    ],
  },
];

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
