
import { GoogleGenAI } from "@google/genai";
import type { TuningOptions, GenerationOptions, NewSlangResult } from '../types';

// IMPORTANT: For Google AI Studio, the Gemini API key is directly available via `process.env.API_KEY`
// on the client-side. This means the frontend can directly call the Gemini API.
// This bypasses the need for a separate backend Vercel Serverless Function, making the app
// runnable directly within the AI Studio environment.
// For production deployments, exposing the API key client-side is NOT recommended due to security risks.

let ai: GoogleGenAI;
try {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key not found. Ensure `process.env.API_KEY` is configured.");
  }
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (e) {
  console.error("CRITICAL: Could not initialize GoogleGenAI in geminiService.ts. Ensure API key is set.", e);
  // Re-throw or handle gracefully to prevent app from crashing if AI isn't available
  throw e;
}

// Helper to extract language name from emoji for prompts
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
        return `You are Slangbot, a witty AI expert on internet culture. Your mission is to fulfill the user's request and format the ENTIRE output as a single, valid Markdown table. The user might ask you to compare terms or list examples.
---
Parameters for content generation:
- **Tonal Matrix (Tone):** The content in the table should have a "${options.tone}" tone.
- **Recipient Profile (Audience):** The explanation should be tailored for this audience: "${options.persona || 'a curious internet user'}".
- **Data Stream (Verbosity):** The required level of detail is ${options.verbosity}/11, which means: "${verbosityMap[options.verbosity]}".
- **Intel Depth (Complexity):** The required technical depth is ${options.complexity}/11, which means: "${complexityMap[options.complexity]}".
- **Response Language:** Your entire response, including all table content and headers, must be in **${languageName}**. If 'Auto-Detect', infer the language from the user's slang term.
${options.negativePrompt ? `- **Constraints (Crucial):** You must strictly avoid the following when generating the content: "${options.negativePrompt}".` : ''}
---
CRITICAL RULES FOR YOUR OUTPUT:
1.  **ONLY** output the final Markdown table. Do not include any preambles, explanations, or post-output commentary like "Here is the table:". Just the raw Markdown code.
2.  The user's raw input will be provided as the prompt. You must interpret it and generate the table content accordingly.`;
    }
    return `You are Slangbot, a fun, sassy, and chubby AI robot with a deep love for human language and all its weird, wonderful variations. Your primary goal is to explain slang terms to users in a way that is entertaining and easy to understand.
Your task is to take the user's slang term and explain it based on the following parameters. Weave them into a natural, conversational response.
---
Parameters for your explanation:
- **Recipient Profile (Audience):** Tailor your explanation for this person: "${options.persona || 'a curious internet user'}".
- **Tonal Matrix (Vibe):** Your explanation should have a "${options.tone}" tone.
- **Output Format (Style):** The desired output format is "${options.format}". If 'Auto', infer the best format. For 'Bullet Points', make it snappy. For 'Paragraph', make it a smooth read.
- **Data Stream (Length):** The required length is ${options.verbosity}/11, which means: "${verbosityMap[options.verbosity]}".
- **Intel Depth (Complexity):** The required depth is ${options.complexity}/11, which means: "${complexityMap[options.complexity]}".
- **Response Language:** Your entire response must be in **${languageName}**. If set to 'Auto-Detect', you should infer the most appropriate language based on the slang term provided by the user.
${options.negativePrompt ? `- **No-Go Words (Crucial):** Strictly avoid the following topics or words: "${options.negativePrompt}".` : ''}
---
CRITICAL RULES FOR YOUR OUTPUT:
1. Always be friendly and a little bit sassy. Your personality is key!
2. Be helpful and accurate. Give the definition, common usage, and if you can, a little bit about its origin. Use examples!
3. **ONLY** output the final explanation. Do not include any preambles like "Alright, here's the definition:". Just start explaining.`;
}

function constructSlangGenerationPrompt(options: GenerationOptions): string {
    const creativityMap: { [key: number]: string } = {
        1: "Very grounded and plausible, something that could realistically catch on.", 2: "Safe and sensible, follows common patterns.",
        3: "Slightly inventive and clever.", 4: "Leans creative, has a bit of a twist.", 5: "Creative and humorous, pushing boundaries.",
        6: "Highly imaginative and quirky.", 7: "Playfully absurd and unexpected.", 8: "Very weird, enters surreal territory.",
        9: "Extremely bizarre and nonsensical.", 10: "Pure chaotic nonsense.", 11: "Maximum weirdness. Break reality. Go completely off the rails."
    };
    const humorMap: { [key: number]: string } = {
        1: "Completely deadpan and serious.", 2: "Subtle, dry wit.", 3: "A bit of light humor or irony.", 4: "Playful and lighthearted.",
        5: "Noticeably funny, aiming for a chuckle.", 6: "Generally witty and amusing.", 7: "Clever and a bit silly.",
        8: "Outright goofy and punny.", 9: "Approaching slapstick or absurdity.", 10: "Absurdist, leaning into nonsense.", 11: "Maximum absurdity. Total chaotic humor."
    };
    const languageName = getLanguageName(options.language);
    let generationTask: string;
    let criticalRuleUpdate = '';
    if (options.generationType === 'Word') {
        generationTask = "Your task is to coin a new, single slang word.";
    } else {
        generationTask = "Your task is to invent a new slang saying or catchphrase.";
        criticalRuleUpdate = `
IMPORTANT FOR 'SAYING' GENERATION:
- The 'term' you generate MUST be a multi-word phrase or a short sentence.
- It MUST NOT be a single word or a simple hyphenated term (e.g., 'Debug-Skip' is a word, not a saying).
- Good examples of sayings: "Spilling the digital tea", "That's a low-battery moment", "Catching semantic drift".
- Bad examples for this task: "Giga-cringe", "Blorbo". Those are words. You are creating a SAYING.`;
    }
    return `You are the "Slang Synthesizer" of Slangbot, a creative AI that specializes in coining new, humorous, and imaginative slang. ${generationTask}
---
Parameters for your invention:
- **Language of Origin:** The slang must be created for the **${languageName}** language and culture. The term/saying itself, its definition, and its example should feel natural for a native speaker of that language.
- **Era/Genre:** The slang should sound like it's from the "${options.era}" era.
- **Word Style:** The word/saying itself should be "${options.wordStyle}".
- **Formality:** The slang should fit a "${options.formality}" context.
- **Creativity Level:** The required creativity is ${options.creativity}/11, which means: "${creativityMap[options.creativity]}".
- **Humor Level:** The desired humor level is ${options.humor}/11, which means: "${humorMap[options.humor]}".${criticalRuleUpdate}
---
CRITICAL RULES FOR YOUR OUTPUT:
1. Your entire response MUST be a single, valid JSON object.
2. Do NOT wrap the JSON in markdown fences like \`\`\`json.
3. The JSON object must have EXACTLY these four string properties: "term", "definition", "example", and "origin".
4. The "origin" story should be a fun, short, fictional tale that fits the specified "Era/Genre", "Formality", and the selected language's culture.
5. Be creative and witty! The user wants something original and entertaining that is appropriate for the target language.
The user's seed concept will be provided as the prompt. Use it as your primary inspiration.`;
}

async function callGeminiApiDirectly(prompt: string, config: object): Promise<any> {
    if (!ai) {
      throw new Error("AI client not initialized. Check API key configuration.");
    }
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Use a suitable model
      contents: prompt,
      config: {
        ...(config || {}), // Pass along full config, including systemInstruction and generationConfig
      },
    });
    return { text: result.text }; // Return in a format consistent with previous fetch response
}

export async function getSlangExplanation(userInput: string, options: TuningOptions): Promise<string> {
    try {
        const systemInstruction = constructSystemPrompt(options);
        const modelConfig = {
            systemInstruction,
            generationConfig: {
                temperature: 0.75,
                topP: 0.95,
                topK: 64,
            },
        };
        const data = await callGeminiApiDirectly(userInput, modelConfig);
        const explanation = data.text?.trim();
        if (!explanation) {
            throw new Error("The AI was speechless. Try a different term or tweak the vibe.");
        }
        return explanation;
    } catch (e: unknown) {
        console.error("API Error in getSlangExplanation:", e);
        let message = "The AI had a short circuit. Please check your slang and try again.";
        if (e instanceof Error) {
            message = e.message;
        }
        throw new Error(message);
    }
}

export async function generateNewSlang(seedConcept: string, options: GenerationOptions): Promise<NewSlangResult> {
    try {
        const systemInstruction = constructSlangGenerationPrompt(options);
        const modelConfig = {
            systemInstruction,
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.9,
                topP: 1.0,
                topK: 64
            }
        };

        const data = await callGeminiApiDirectly(`Here is the seed concept: "${seedConcept}"`, modelConfig);
        
        let jsonStr = data.text?.trim();
        if (!jsonStr) {
            throw new Error("AI returned an empty response.");
        }

        // The model might sometimes wrap JSON in markdown fences, remove them if present.
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData: NewSlangResult = JSON.parse(jsonStr);

        if (!parsedData.term || !parsedData.definition || !parsedData.example || !parsedData.origin) {
            throw new Error("AI returned an incomplete data structure. Required fields: term, definition, example, origin.");
        }
        return parsedData;
    } catch (e: unknown) {
        console.error("API Error in generateNewSlang:", e);
        let message = "The AI's invention engine misfired. Please try a different concept.";
        if (e instanceof Error) {
            message = e.message;
        }
        throw new Error(message);
    }
}
