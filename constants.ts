import type { Tone, Format, TuningOptions, GenerationOptions, Language } from './types';

export const TONES: Tone[] = ['Sassy & Fun', 'Scholarly', 'Simple & Clear', "Like I'm 5", 'Dramatic & Theatrical', 'Cryptic & Mysterious'];
export const FORMATS: Format[] = ['Auto', 'Paragraph', 'Bullet Points', 'JSON', 'Markdown Table'];

export const ERAS = [
    'Modern Internet', 
    '1990s Skater', 
    '1980s Valley Girl', 
    '1960s Hippie', 
    '1920s Flapper',
    'Victorian Era',
    'Roaring Twenties',
    'Shakespearean',
    'Futuristic Cyberpunk',
    'Custom...',
] as const;

export const WORD_STYLES = [
    'Catchy & Short', 
    'Weird & Complex', 
    'Professional Buzzword',
    'Scientific Jargon',
    'Whimsical & Poetic',
    'Custom...',
] as const;

export const RECIPIENT_PRESETS = [
    "A Confused Parent",
    "A Fellow Gamer",
    "Your Best Friend",
    "A Marketing Executive",
    "A Time Traveler from 1890",
    "A History Professor",
    "A Sassy AI Assistant",
    "Custom...",
] as const;

export const FORMALITY_STYLES = [
    'Casual Street Slang',
    'Ironic Corporate Buzzword',
    'Poetic & Flowery',
    'Blunt & Direct',
    'Custom...',
] as const;

export const LANGUAGES = [
    '🇬🇧 English',
    '🇪🇸 Spanish',
    '🇫🇷 French',
    '🇩🇪 German',
    '🇯🇵 Japanese',
    '🤖 Auto-Detect',
] as const;


export const DEFAULT_TUNING_OPTIONS: TuningOptions = {
    tone: 'Simple & Clear',
    format: 'Auto',
    verbosity: 5,
    complexity: 5,
    persona: 'A Confused Parent',
    negativePrompt: '',
    language: '🇬🇧 English',
};

export const DEFAULT_GENERATION_OPTIONS: GenerationOptions = {
    era: 'Modern Internet',
    wordStyle: 'Catchy & Short',
    creativity: 5,
    humor: 5,
    formality: 'Casual Street Slang',
    language: '🇬🇧 English',
    generationType: 'Word',
};

// Placeholder sounds for the experimental mods.
// The user will need to provide these files in /public/assets/sounds/
export const MOD_SOUNDS = {
    quantumFlux: {
        on: '/assets/sounds/flux_on.wav',
        off: '/assets/sounds/flux_off.wav',
    },
    hyperbole: {
        on: '/assets/sounds/hyper_on.wav',
        off: '/assets/sounds/hyper_off.wav',
    },
    deionizer: {
        on: '/assets/sounds/deionizer_on.wav',
        off: '/assets/sounds/deionizer_off.wav',
    },
    nonsense: {
        on: '/assets/sounds/nonsense_on.wav',
        off: '/assets/sounds/nonsense_off.wav',
    },
} as const;

export const AMPLIFIER_SOUNDS = {
    scanner: {
        on: '/assets/sounds/scanner_on.wav',
        off: '/assets/sounds/scanner_off.wav',
    },
    probe: {
        on: '/assets/sounds/probe_on.wav',
        off: '/assets/sounds/probe_off.wav',
    },
    analyzer: {
        on: '/assets/sounds/analyzer_on.wav',
        off: '/assets/sounds/analyzer_off.wav',
    },
} as const;