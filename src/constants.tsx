
import { Platform, PlatformConfig, Tone, ToneConfig } from './types';

export const PLATFORMS: PlatformConfig[] = [
  {
    id: Platform.LINKEDIN,
    maxChars: 3000,
    icon: '💼',
    description: 'Professional, insight-driven, spaced for readability.'
  },
  {
    id: Platform.X,
    maxChars: 280,
    icon: '𝕏',
    description: 'Concise, punchy, focused on one core idea.'
  },
  {
    id: Platform.INSTAGRAM,
    maxChars: 2200,
    icon: '📸',
    description: 'Visual storytelling, engaging hooks, grouped hashtags.'
  },
  {
    id: Platform.FACEBOOK,
    maxChars: 5000,
    icon: '👥',
    description: 'Conversational, community-focused, storytelling.'
  },
  {
    id: Platform.TIKTOK,
    maxChars: 4000,
    icon: '🎵',
    description: 'Visual hooks, spoken scripts, and concise captions.'
  },
  {
    id: Platform.YOUTUBE,
    maxChars: 5000,
    icon: '📺',
    description: 'Structured titles, clear descriptions, and searchable tags.'
  }
];

export const TONES: ToneConfig[] = [
  { id: Tone.PROFESSIONAL, label: 'Professional', description: 'Authoritative yet approachable.' },
  { id: Tone.FRIENDLY, label: 'Friendly', description: 'Warm, conversational, and inclusive.' },
  { id: Tone.HUMOROUS, label: 'Humorous', description: 'Witty, lighthearted, and relatable.' },
  { id: Tone.INFORMATIVE, label: 'Informative', description: 'Clear, educational, and direct.' },
  { id: Tone.URGENT, label: 'Urgent', description: 'Direct, time-sensitive, and bold.' },
];

export const EXAMPLE_PROMPTS = [
  {
    label: 'The Chef',
    text: "Anthony Bourdain is the best chef. He understood that food wasn't just about the plate, it was about the culture, the people, and the struggle behind the kitchen doors. He taught us how to travel with an open heart."
  },
  {
    label: 'Sustainability',
    text: "reasons why you should stop buying fast fashion: it's killing the planet, the workers are treated like machines, and the quality is so low you're basically buying trash that lasts three washes. Support slow fashion instead."
  },
  {
    label: 'Tech Ethics',
    text: "ai...friend or foe? It feels like we're handing over our creativity to algorithms, but at the same time, it's making the boring parts of work disappear. Is it progress or just a massive shortcut?"
  },
  {
    label: 'Focus',
    text: "Most people think they need a 10-step morning routine to be productive. Actually, you just need to put your phone in another room, sit in a chair, and do the one thing you're avoiding."
  }
];

export { SYSTEM_INSTRUCTION } from '../shared/systemInstruction';
