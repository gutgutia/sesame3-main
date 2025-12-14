# Sesame3 Product Philosophy — "Rich & Calm"

This document outlines the core product principles, interaction models, and design philosophy behind Sesame3. It serves as the "North Star" for ensuring the application remains a source of clarity and calm for stressed students, while providing the depth of functionality required for elite college preparation.

---

## 1. Core Ethos: "Rich & Calm"

The central tension Sesame3 resolves is between **Complexity** (the college process) and **Anxiety** (the student's state).

*   **Calm ≠ Empty:** We do not achieve calmness by hiding information or dumbing down the process. We achieve it by *organizing* complexity.
*   **Richness:** The dashboard must be substantive. It tracks Dream Schools, 6-Pillar Portfolios, Goal Roadmaps, and Decision Funnels. It is not a toy; it is a command center.
*   **The "One Thing" Rule:** While the data is deep, the *immediate* interface always highlights "The One Thing" the student needs to focus on right now to prevent decision paralysis.

---

## 2. Interaction Model: Conversational First

Sesame3 moves away from traditional "Forms & Tables" toward a **Conversational UI**.

### The "Advisor" Mode
*   **Primary Action:** The primary way to input data, update goals, or make decisions is by talking to the AI Advisor (`Sesame`).
*   **Immersive Experience:** The Advisor is not a tiny chatbot widget in the corner; it is a full-screen, immersive experience that takes center stage when guidance is needed.
*   **Context Aware:** The Advisor knows the student's current page (Portfolio, Plan, Schools) and offers context-specific help (e.g., "Analyze my profile match for Stanford" while on the Schools page).

### "No Form Fatigue"
*   **Data Entry via Chat:** Instead of filling out a 20-field profile form, the user answers simple questions: *"What was your SAT score?"*, *"Which clubs did you lead?"*.
*   **Smart Parsing:** The system extracts structured data from natural language and presents it for confirmation.

---

## 3. Agency & Control: "Human-in-the-Loop"

We use AI to reduce friction, but we **never** remove user agency.

### The "Suggest & Confirm" Pattern
1.  **User Intent:** User says "I got a 1520 on my SAT."
2.  **AI Parsing:** AI understands this updates the `Testing` pillar.
3.  **Visual Confirmation (Widget):** Instead of silently updating the database, the AI renders a **Confirmation Widget** in the chat stream:
    *   *Show Old Value:* (e.g., "1450")
    *   *Show New Value:* (e.g., "1520")
    *   *Action:* User clicks "Confirm Update".
4.  **Commit:** Only after explicit user action is the data saved.

*Why?* This builds trust. The user feels they are "building" their profile with an assistant, not being "watched" by a black box.

---

## 4. Information Architecture: Progressive Disclosure

To maintain calmness, we reveal depth only as needed.

### The Hierarchy
1.  **Focus (Dashboard):** What do I do *today*? (Tasks, Next Steps).
2.  **Plan (Strategy):** How do I get there? (Goals -> Opportunities -> Tasks).
3.  **Portfolio (Evidence):** What have I done? (The 6 Pillars: Academics, Testing, Honors, Activities, Service, Leadership).
4.  **Schools (Target):** Where am I going? (Reach/Target/Safety + Match Analysis).

### Visual Metaphors
*   **"Living Resume":** The Portfolio isn't just a form; it's a visual grid that shows strength/weakness at a glance (e.g., "Spike" in Leadership, "Gap" in Testing).
*   **"Decision Funnel":** The Schools page isn't just a list; it's a funnel from "Exploring" to "Applied" to "Accepted".

---

## 5. Onboarding: "Day 1 Clarity"

The first 5 minutes are critical for reducing anxiety.

*   **Frictionless Entry:** Google / Email+Code (No passwords).
*   **Conversational Setup:** We don't drop them into an empty dashboard. A brief chat (Grade, Feeling, Goal) sets the emotional tone.
*   **Personalized Landing:** The "Day 1" dashboard is pre-populated based on that chat, giving them an immediate sense of "I am in the right place, and this is manageable."
