import { RECIPIENT_PRESETS, ERAS, WORD_STYLES, FORMALITY_STYLES, LANGUAGES } from './constants';

export type Tone = 'Sassy & Fun' | 'Scholarly' | 'Simple & Clear' | "Like I'm 5" | 'Dramatic & Theatrical' | 'Cryptic & Mysterious';
export type Format = 'Auto' | 'Paragraph' | 'Bullet Points' | 'JSON' | 'Markdown Table';

// Create types from the constant arrays
type EraPreset = typeof ERAS[number];
type WordStylePreset = typeof WORD_STYLES[number];
type RecipientPreset = typeof RECIPIENT_PRESETS[number];
export type FormalityStylePreset = typeof FORMALITY_STYLES[number];
export type Language = typeof LANGUAGES[number];


export interface TuningOptions {
    tone: Tone;
    format: Format;
    verbosity: number; // 1 to 11 scale
    complexity: number; // 1 to 11 scale
    persona: RecipientPreset | string;
    negativePrompt: string;
    language: Language;
}

export type GenerationType = 'Word' | 'Saying';

export interface GenerationOptions {
    era: EraPreset | string;
    wordStyle: WordStylePreset | string;
    formality: FormalityStylePreset | string;
    creativity: number; // 1 to 11 scale
    humor: number; // 1 to 11 scale
    language: Language;
    generationType: GenerationType;
}

export interface HistoryItem {
    id: number;
    timestamp: string;
    userInput: string;
    tuningOptions: TuningOptions;
    generatedPrompt: string;
}

export interface SharedRecipe {
    userInput: string;
    tuningOptions: TuningOptions;
}

export interface SharedGenerationRecipe {
    seedConcept: string;
    generationOptions: GenerationOptions;
}

export interface NewSlangResult {
    term: string;
    definition: string;
    example: string;
    origin: string;
}