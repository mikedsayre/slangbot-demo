import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TuningOptions, GenerationOptions, NewSlangResult } from '../types';

// 1. Initialize the AI Client with the VITE_ prefixed variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("CRITICAL: Gemini API key not found. Check .env file or Vercel Settings.");
  // We don't throw immediately here to avoid crashing the whole app on load, 
  // but calls will fail if this is missing.
}

const genAI = new GoogleGenerativeAI(apiKey);

// Helper to extract language name from emoji
const getLanguageName = (langWithEmoji: string) => {
    return langWithEmoji.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|\u2600-\u26FF|\u2700-\u27BF/gu, '').trim();
}

function constructSystemPrompt(options: TuningOptions): string {
    const verbosityMap: { [key: number]: string } = {
        1: "TL;DR - A one-sentence summary.", 2: "Super concise, like a tweet.", 3: "Brief, just the key points.",
        4: "A quick paragraph.", 5: "Moderately detailed.", 6: "Slightly more detailed than average.",
        7: "Comprehensive, covers most angles.", 8: "Very thorough, leaves no stone unturned.",
        9: "Extremely detailed, like a mini-essay.", 10: "In-depth, providing deep context and history.",
        11: "Maximum detail, an exhaustive scholarly analysis."
    };
    const complexityMap: { [key: number]: string } = {
        1: "Explain like I'm 5. The simplest possible terms.", 2: "Very simple, for a complete beginner.",
        3: "Simplified, using basic terminology.", 4: "Easy to understand for a casual user.",
        5: "Standard explanation, assuming some cultural context.", 6: "A bit more technical, uses some jargon.",
        7: "Advanced, discussing nuance and etymology.", 8: "Expert-level, deep linguistic and cultural analysis.",
        9: "Highly academic and theoretical.", 10: "Profoundly complex, suitable for a PhD thesis.",
        11: "Maximum complexity, for a leading linguist."
    };
    const languageName = getLanguageName(options.language);

    if (options.format === 'Markdown Table') {
        return `You are Slangbot. format the ENTIRE output as a single, valid Markdown table.
---
Parameters:
- **Tone:** ${options.tone}
- **Audience:** ${options.persona || 'a curious internet user'}
- **Detail Level:** ${options.verbosity}/11 (${verbosityMap[options.verbosity]})
- **Complexity:** ${options.complexity}/11 (${complexityMap[options.complexity]})
- **Language:** ${languageName}
${options.negativePrompt ? `- **Avoid:** ${options.negativePrompt}` : ''}
---
RULES:
1. ONLY output the Markdown table. No text before or after.`;
    }

    return `You are Slangbot, a witty AI expert. Explain this slang term.
---
Parameters:
- **Audience:** ${options.persona || 'a curious internet user'}
- **Tone:** ${options.tone}
- **Format:** ${options.format}
- **Length:** ${options.verbosity}/11 (${verbosityMap[options.verbosity]})
- **Depth:** ${options.complexity}/11 (${complexityMap[options.complexity]})
- **Language:** ${languageName}
${options.negativePrompt ? `- **Avoid:** ${options.negativePrompt}` : ''}
---
RULES:
1. Be friendly and sassy.
2. ONLY output the explanation. No preambles.`;
}

function constructSlangGenerationPrompt(options: GenerationOptions): string {
    const languageName = getLanguageName(options.language);
    let generationTask = options.generationType === 'Word' 
        ? "Coin a new, single slang word." 
        : "Invent a new slang saying/catchphrase (must be multi-word).";

    return `You are the "Slang Synthesizer". ${generationTask}
---
Parameters:
- **Language:** ${languageName}
- **Era:** ${options.era}
- **Style:** ${options.wordStyle}
- **Creativity:** ${options.creativity}/11
- **Humor:** ${options.humor}/11
---
CRITICAL RULES:
1. Response MUST be valid JSON.
2. NO markdown formatting (don't use \`\`\`json).
3. JSON structure: { "term": "...", "definition": "...", "example": "...", "origin": "..." }
4. The origin story should be fictional and fun.`;
}

// Unified function to call the API
async function callGemini(prompt: string, systemInstruction: string, jsonMode: boolean = false): Promise<string> {
    if (!apiKey) throw new Error("Gemini API Key missing.");

    // Initialize the specific model
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemInstruction, // System prompt goes here in the new SDK
        generationConfig: {
            responseMimeType: jsonMode ? "application/json" : "text/plain",
            temperature: 0.8,
        }
    });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}

export async function getSlangExplanation(userInput: string, options: TuningOptions): Promise<string> {
    const systemPrompt = constructSystemPrompt(options);
    const text = await callGemini(userInput, systemPrompt, false);
    return text.trim();
}

export async function generateNewSlang(seedConcept: string, options: GenerationOptions): Promise<NewSlangResult> {
    const systemPrompt = constructSlangGenerationPrompt(options);
    
    // Pass 'true' for JSON mode
    let jsonStr = await callGemini(`Seed Concept: "${seedConcept}"`, systemPrompt, true);
    
    // Cleanup if the model adds markdown fences despite our instructions
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }

    try {
        const parsedData: NewSlangResult = JSON.parse(jsonStr);
        if (!parsedData.term || !parsedData.definition) {
             throw new Error("Incomplete JSON received from AI");
        }
        return parsedData;
    } catch (e) {
        throw new Error("Failed to parse AI response as JSON.");
    }
}
