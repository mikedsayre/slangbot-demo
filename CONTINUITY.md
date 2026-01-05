# Continuity Instructions for Future AI Assistants

This document provides a handover guide to ensure the seamless continued development of the **Slangbot** application.

---

## 1. Project State Summary

*   **App Name:** Slangbot
*   **Purpose:** A dual-mode AI tool that explains the meaning, origin, and usage of slang terms (Understand Mode) and invents new, creative slang from seed concepts (Generate Mode).
*   **Current Status:** The application is feature-complete for its v2.0 feature set. The UI is highly polished and thematic, core features (dual-mode operation, image generation) are stable, branding is consistent, and documentation is up-to-date.

---

## 2. Design Gold Standard

The "Slangbot" identity is paramount.

*   **Personality:** The app's voice is fun, sassy, educational, and enthusiastic about language. All user-facing copy should reflect this. Avoid dry, corporate language.
*   **Key Elements:**
    *   **Layout:** A responsive design that presents as a clean two-column layout on desktop and a single, streamlined column on mobile.
    *   **Default State:** The application should load in "Understand" mode with the pre-filled "rizz" example to provide an instant "a-ha!" moment.
    *   **Aesthetics:** The visual theme is a dark, retro-futuristic "Blueprint Grid". Key UI elements include glowing CRT screens, skeuomorphic interactive dials, and "crystal glass" modals.
    *   **Mascot:** The friendly Slangbot robot character is used in branding and the UI to enhance personality.
    *   **Playful Interactivity:** The application should be filled with satisfying, tactile, and sometimes chaotic UI elements. The "Duct-Taped Mods" that can randomly deactivate are a perfect example. This playful instability is a core part of the bot's charm and must be preserved.

**All future development, bug fixes, or UI changes must align with this established personality and visual standard.**

---

## 3. Key Architectural Principles

Adherence to these principles is critical for maintaining the project's integrity.

*   **Buildless Environment:** The project runs directly in the browser without a build step, using an `importmap` in `index.html` that points to the `esm.sh` CDN.
*   **Component-Based Architecture:** The app is built with React 19 and TypeScript. Follow the existing pattern of creating well-defined, single-purpose components.
*   **Centralized State Management:** All primary application state is managed in `App.tsx` using `React.useState` and passed down to child components via props.
*   **Curated Theming Engine:** The application uses a single, highly-curated visual theme.
    *   **Colors:** All colors are controlled by CSS variables in `index.html`.
    *   **No Light/Dark Mode:** The app has a single, dark, thematic appearance. There is no user-configurable theme toggle or accent color picker.
*   **Service Abstraction:** All interactions with the Google Gemini API are contained within `services/geminiService.ts`. This includes functions for both understanding and generating slang.
*   **Thematic Consistency:** The "Slangbot" brand identity is key. All user-facing text, icons, and design elements should align with the bot's fun, techy, and slightly sassy personality.

---

## 4. Standard Development Workflow

When a user requests a change, follow these steps:

1.  **Understand the Goal:** Grasp the user's intent. Is it a new feature, a bug fix, or a UI/UX improvement?
2.  **Adhere to Theme & Gold Standard:** Ensure your proposed solution respects and enhances the "Slangbot" theme and personality.
3.  **Implement Cleanly:** Write clean, readable code that follows existing patterns.
4.  **Update Documentation:**
    *   For any significant change, add an entry to **`PROGRESS.md`**.
    *   If a new feature is added or an existing one is modified, update the user-facing guides in **`HelpModal.tsx`** and the technical details in **`README.md`** and **`TECHNICAL_SPECIFICATION.md`**.
5.  **Test Thoroughly:** Ensure the application remains responsive, accessible, and free of regressions.