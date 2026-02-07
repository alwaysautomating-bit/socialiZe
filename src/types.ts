
export enum Platform {
  LINKEDIN = 'LinkedIn',
  X = 'X (Twitter)',
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  TIKTOK = 'TikTok',
  YOUTUBE = 'YouTube',
}

export enum Tone {
  PROFESSIONAL = 'Professional',
  FRIENDLY = 'Friendly',
  HUMOROUS = 'Humorous',
  INFORMATIVE = 'Informative',
  URGENT = 'Urgent',
}

export interface ToneAnalysis {
  score: number;
  currentToneDescription: string;
  feedback: string;
  suggestions: string[];
}

export interface OptimizationResult {
  platform: Platform;
  targetTone: Tone;
  content: string;
  hashtags: string[];
  rationale: string;
  charCount: number;
  analysis: ToneAnalysis;
}

export interface PlatformConfig {
  id: Platform;
  maxChars: number;
  icon: string;
  description: string;
}

export interface ToneConfig {
  id: Tone;
  label: string;
  description: string;
}
