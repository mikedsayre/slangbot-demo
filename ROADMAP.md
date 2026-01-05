# Slangbot - Product Roadmap

This document outlines the strategic vision and planned feature development for Slangbot. Our goal is to evolve from a fun utility into an indispensable tool for understanding modern language and culture.

---

## Phase 1: Core Experience (Current)

These features form the foundation of the Slangbot experience.

- **Dual-Mode Operation:** Understand and generate slang. ✅
- **Interactive Tuning:** Dials and dropdowns for creative control. ✅
- **Voice Input:** Web Speech API integration. ✅
- **Shareable Links & Images:** Shareable URLs and generated "certificate" images. ✅
- **Thematic UI:** Retro-futuristic console aesthetic with rich, interactive elements. ✅

---

## Phase 2: Deeper Context & User Engagement

This phase introduces features that provide richer context and encourage user interaction.

### 1. Slang of the Day
- **Description:** On the homepage, feature a "Slang of the Day" with a pre-generated explanation. This would change daily.
- **User Value:** Encourages daily engagement and introduces users to new terms, making the app a fun learning destination.
- **Status:** Planned.

### 2. Historical Context & Timelines
- **Description:** For certain well-known terms, generate a small timeline visual showing when the slang emerged and peaked in popularity, using Gemini's knowledge.
- **User Value:** Adds a fascinating educational layer, showing how language evolves over time.
- **Status:** Planned.

### 3. "I've Heard This" Button
- **Description:** A simple upvote-style button that lets users mark if they've heard a term in the wild. This data could be used to create a "trending slang" list.
- **User Value:** Adds a fun, interactive element and creates a community-driven view of what's popular.
- **Status:** Planned.

---

## Phase 3: Global Expansion

This phase focuses on making Slangbot a truly global tool, building upon the simple response-language feature.

### 1. Full Internationalization (i18n)
- **Description:** Translate the entire application user interface (all labels, buttons, tooltips, and guides) into multiple languages. This is a significant undertaking beyond simply changing the AI's response language.
- **User Value:** Provides a native experience for non-English speaking users, dramatically expanding the app's accessibility and reach.
- **Technical Considerations:**
    - Requires an i18n library (e.g., `i18next`).
    - All UI strings must be extracted into language-specific resource files.
    - Gemini prompts in `geminiService.ts` would need to be professionally translated and culturally adapted for each language to maintain their effectiveness.
    - Culturally-specific tuning options (like `Era` or `Recipient Profile`) would need to be researched and created for each locale.
- **Status:** Planned.

### 2. Region-Aware Slang
- **Description:** Enhance the AI to understand and generate slang specific to different regions that share a language (e.g., UK vs. US English, or Spain vs. Mexico Spanish).
- **User Value:** Provides deeper, more accurate cultural context.
- **Status:** Planned.


---

## Future Exploration (The Bot's Big Dreams)

Ideas to be considered for development after the core roadmap is complete.

### Slang Battle
- **Description:** A feature where users can pit two slang words against each other (e.g., "yeet" vs. "kobe") and get a fun, AI-generated comparison of their usage and history.

### Hybrid Dictionary Mode
- **Description:** As brainstormed in the original PDF, integrate with a third-party API like Urban Dictionary (unofficial) as a fallback or for an alternative, crowdsourced definition. Slangbot could present both its own explanation and the UD one.