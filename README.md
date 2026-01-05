# Slangbot - Your AI Guide to Slang

**Tagline:** The dictionary of now. The laboratory of next.

Slangbot is your fun, sassy AI partner for the ever-evolving world of slang. It's a dual-mode, AI-powered tool that can decipher any slang term you've heard (the dictionary of now) or help you invent the next viral phrase (the laboratory of next). From "rizz" to "cheugy," get easy-to-understand definitions, or cook up a brand new word with its own hilarious origin story.

---

## Table of Contents

- [How It Works](#how-it-works)
- [How to Use](#how-to-use)
  - [Mode 1: Understand Slang](#mode-1-understand-slang)
  - [Mode 2: Generate Slang](#mode-2-generate-slang)
- [Special Feature: Make it Official!](#special-feature-make-it-official)
- [Setup and Installation (Google AI Studio Testing)](#setup-and-installation-google-ai-studio-testing)
- [Deployment to Vercel (Original Target)](#deployment-to-vercel-original-target)
- [Technology Stack](#technology-stack)

---

## How It Works

Language is always changing, and it's tough to keep up! Slangbot is here to help. It's a knowledgeable (and slightly sassy) AI robot that lives in a retro-futuristic console and loves language. It operates in two modes:

1.  **Understand Slang:** You give it a slang word, and it gives you the "lowdown"—a full explanation, including what it means, how it's used, and where it came from.
2.  **Generate Slang:** You give it a seed concept (like "a grumpy pigeon"), and it uses its "Invention Engine" to coin a brand new slang word, complete with a definition, example usage, and a creative origin story.

## How to Use

Use the main switch at the top to toggle between "Understand Slang" and "Generate Slang".

### Mode 1: Understand Slang

This is where you ask about the slang you've heard.

-   **Input Receiver:** Enter the word or phrase you're curious about. You can also use the microphone icon for voice input.
-   **Vibe Check:** Calibrate *how* you want the explanation delivered using interactive dials and dropdowns. Engage the fun "Cognitive Amplifier" buttons for extra flair. You can even choose the language of the response.
-   **Get Lowdown:** When you're ready, hit this button to get your explanation in "The Lowdown" panel.

### Mode 2: Generate Slang

This is your creative playground for inventing new words.

-   **Seed Concept:** Enter a topic or idea to inspire the AI (e.g., "my coffee needs more coffee").
-   **Invention Engine:** Tune the parameters for your new word using dials for creativity and dropdowns for era and style. Don't forget to play with the chaotic, "Duct-Taped Mods"—their effects are... unpredictable.
-   **Cook Up Slang:** Hit this button and the "Spec Sheet" panel will display your brand new, ready-to-use slang term.

## Special Feature: Make it Official!

Once you get a result in either mode, a new button appears in the output panel:

-   **Get the Official Lowdown (Understand Mode):** Generates a shareable, official-looking "Official Lowdown" certificate of the slang explanation. Perfect for educating your friends (or parents!).
-   **Stamp It & Make It Official! (Generate Mode):** Creates a "Certificate of Linguistic Innovation" for your newly invented word. Proof that you're a language pioneer!

Both options open a preview of the image in a pop-up modal with a download button.

## Setup and Installation (Google AI Studio Testing)

This section details how to run the application directly within Google AI Studio. **Note:** For AI Studio testing, the Gemini API key is accessed directly from the frontend, which is not a secure architecture for public production deployments.

1.  **Paste the code into Google AI Studio.** Ensure all provided files are correctly placed in the AI Studio editor.

2.  **API Key:** In the Google AI Studio environment, the Gemini API key is automatically available as `process.env.API_KEY`. No manual `.env` file creation is needed for AI Studio.

3.  **Run:** Click the "Run" button in the Google AI Studio interface. The application should now function, using the `process.env.API_KEY` for direct API calls.

## Deployment to Vercel (Original Target)

If you wish to deploy this application to Vercel as originally intended, you will need to revert the API call architecture to use a secure serverless function.

1.  **Revert `services/geminiService.ts`:** Restore this file to its previous state, which made `fetch` requests to `/api/slangbotApi`.
2.  **Restore Vercel Backend Files:** Re-add the `api/slangbotApi.ts` serverless function and `vercel.json` to your project root.
3.  **Install Vercel CLI & Set Environment Variable:**
    *   Install Vercel CLI: `npm install -g vercel`
    *   Create a `.env.local` file in your root and add `GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"`.
    *   Set the `GEMINI_API_KEY` environment variable in your Vercel project dashboard.
4.  **Run Locally (Vercel):** `npm run dev` (or `vercel dev`)
5.  **Deploy to Vercel:** `vercel --prod`

## Technology Stack

-   **Framework:** React 19 (Vite)
-   **Language:** TypeScript
-   **AI:** Google Gemini API (`@google/genai`)
-   **Styling:** Tailwind CSS
-   **Voice Input:** Web Speech API
-   **Image Generation:** HTML Canvas API
-   **Hosting & Deployment:** For AI Studio testing, direct client-side. For production, Vercel (requires architectural adjustments).
