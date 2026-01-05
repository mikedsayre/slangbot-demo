# Slangbot - Technical Specification

This document provides a comprehensive technical overview of the Slangbot web application. It is intended for developers (human or AI) to understand the project's architecture, technology stack, and core components.

---

## 1. Project Overview

-   **Application Name:** Slangbot
-   **Tagline:** The dictionary of now. The laboratory of next.
-   **Description:** An AI-powered assistant that explains the meaning, origin, and usage of slang terms (Understand Mode) and invents new slang words from seed concepts (Generate Mode). It features deep customization of the AI's response style, including tone, complexity, and language.

---

## 2. Technology Stack

-   **Frontend Framework:** React 19
-   **Language:** TypeScript
-   **Module Resolution:** ES Modules via `importmap` in `index.html`.
-   **Backend (for AI Studio Testing):** Direct client-side calls to Google Gemini API.
-   **Backend (for Vercel Deployment):** Vercel Serverless Functions (Node.js runtime) - *requires architectural reversion*.
-   **AI Service:** Google Gemini API via the `@google/genai` SDK (`gemini-3-flash-preview` model).
-   **Voice Recognition:** Web Speech API.
-   **Image Generation:** HTML Canvas API (client-side).
-   **Styling:** Tailwind CSS (v3) via the CDN script.
-   **Hosting & Deployment:** Google AI Studio (for testing). Vercel (for production deployment - *requires architectural reversion*).

---

## 3. Core Features

-   **Dual-Mode Operation:**
    -   **Understand Slang:** Core feature using the Gemini API to explain slang terms.
    -   **Generate Slang:** Creative feature using the Gemini API to invent new slang words.
-   **Explanation Tuning ("Vibe Check"):** Allows users to control the AI's explanation style, including `Audience`, `Vibe`, `Style`, and `Language`.
-   **Generation Tuning ("Invention Engine"):** Allows users to control the AI's invention style, including `Era`, `Word Style`, and `Creativity`.
-   **Interactive Dials:** Custom, skeuomorphic dial components for setting numerical parameters.
-   **Interactive Mods:** Fun, thematic toggle buttons ("Duct-Taped Mods" and "Cognitive Amplifiers") with chaotic, unpredictable animations and sound effects that enhance the user experience.
-   **Certificate Image Generation:** Client-side generation of shareable certificate images for both modes.
-   **Voice Input:** Integrates the Web Speech API to allow users to dictate slang terms.
-   **Shareable Definitions:** Functionality to generate a URL that contains a slang term and tuning settings.
-   **Copy to Clipboard:** One-click functionality to copy the final explanation.
-   **Client-Side History:** Saves all slang lookups to `localStorage`.
-   **Responsive Design:** A two-column layout on large screens that collapses to a single column on mobile.

---

## 4. Architecture & File Structure (Google AI Studio Testing)

For Google AI Studio testing, the application operates purely client-side due to the environment's execution model.

-   **Frontend (Root Directory):**
    -   `index.html`: The single HTML entry point.
    -   `index.tsx`: The React application entry point.
    -   `App.tsx`: The main component, managing top-level state.
    -   `/components`: Contains all React components.
    -   `/services/geminiService.ts`: **Client-side service.** Directly initializes the `@google/genai` client and calls the Gemini API using `process.env.API_KEY`.
    -   `/types.ts` & `/constants.ts`: Shared types and constants for the frontend.
-   **Backend Files (`/api` directory and `vercel.json`):** These files are **removed** for AI Studio testing as they are specific to a Vercel serverless backend and are not executable in this client-side environment.

---

## 5. State Management

-   **Strategy:** State is managed in the top-level `App.tsx` component using `React.useState` and passed down as props (unidirectional data flow).
-   **Persistence:** `slangbotHistory` and `slangbotSound` preferences are stored in `localStorage`.

---

## 6. API Integration (Google AI Studio Testing)

-   **Authentication:** The Gemini API key is provided directly by the Google AI Studio environment as `process.env.API_KEY`. It is accessed client-side.
    -   **Security Note:** This architecture exposes the API key to the client. This is acceptable for Google AI Studio testing but is **not recommended for public production deployments** due to security risks. For production, a server-side proxy or serverless function should be used to securely manage the API key.
-   **Flow:**
    1. The React frontend (`geminiService.ts`) directly initializes the `@google/genai` client using `process.env.API_KEY`.
    2. The frontend then calls the Gemini API with the appropriate prompt and configuration.
    3. The Gemini API's response is returned directly to the frontend, which then displays it to the user.
