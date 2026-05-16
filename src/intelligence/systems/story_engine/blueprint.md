# AI Story Generation Engine | Cinematic English Blueprint

This document defines the architecture, strategy, and governance for the autonomous content generation engine of Cinematic English.

## 1. Modular Generation Pipeline (Task 1)
To ensure "Netflix-level" quality, stories are generated through a 10-step serial processing flow:

1.  **Theme Selection**: Identifying high-impact psychological or social themes.
2.  **Emotional Tone Mapping**: Defining the HSL (Hue, Saturation, Lightness) of the mood (e.g., "The Void" - #050508).
3.  **Narrative Structure**: 3-act cinematic structure (The Hook, The Conflict, The Revelation).
4.  **Dialogue Generation**: Writing for the ear, not the eye. Use of pauses, breath markers, and subtext.
5.  **Vocabulary Layering**: Injecting "Power Phrases" naturally into the narrative.
6.  **Shadowing Optimization**: Breaking lines into rhythmic chunks (max 7-10 words per breath).
7.  **Speaking Moment Injection**: Identifying 2-3 "High-Emotion" lines for AI coaching.
8.  **Cliffhanger Creation**: Ending with an emotional or intellectual unresolved tension.
9.  **Continuation Hooks**: Subtle references to the next story in the chain.
10. **Momentum Sequencing**: Batching stories into "Binge-worthy" sets.

## 2. Story Category System (Task 2)
| Category | Atmosphere | Vocabulary Profile | Speaking Style |
| :--- | :--- | :--- | :--- |
| **Psychological Stories** | Intense, introspective | Mind, bias, perception | Slow, deliberate, whispered |
| **Dark Motivation** | High-energy, gritty | Grit, discipline, scars | Punchy, staccato, driving |
| **Quiet Confidence** | Calm, authoritative | Presence, grace, poise | Low-register, steady rhythm |
| **Modern Relationships** | Vulnerable, complex | Boundaries, nuance, spark | Conversational, varied pacing |
| **Power & Influence** | Formal, strategic | Leverage, chess, silence | Command-style, pauses for effect |

## 3. Language Immersion & Shadowing Design (Tasks 3 & 4)
- **Naturalism**: No "Hello, how are you?" scripts. We use: "It's not about the money. It's about the message."
- **Rhythm-Based Writing**: Sentences are crafted with a musical cadence (Iambic or Trochaic influence) to make them "sticky" for shadowing.
- **Emotional Repetition**: Key phrases are repeated in different emotional contexts to solidify memory without being boring.

## 4. Emotional Vocabulary Engine (Task 5)
Focus on words that give the user **Power**:
- **Emotions**: *Resentment, Serenity, Ambivalence.*
- **Persuasion**: *Compelling, Leverage, Pivot.*
- **Confidence**: *Unwavering, Presence, Grounded.*
- **Self-Expression**: *Articulate, Nuance, Resonance.*

## 5. Momentum Chains (Task 6)
Stories are linked by **"The Thread"**:
- **Chain 1: The Architect of Power** (3 Stories)
    - Part 1: *The Silence* (Listening as power)
    - Part 2: *The Move* (Strategic action)
    - Part 3: *The Throne* (The cost of success)

## 6. Content Metadata System (Task 8)
Every story JSON must include:
```json
{
  "metadata": {
    "emotionalTone": "The Void",
    "difficulty": "B2",
    "speakingIntensity": "High",
    "pacingProfile": "Slow-Burn",
    "immersionScore": 0.95,
    "bingeChain": "PowerArchitect_01",
    "vocabFocus": ["Strategic Silence", "Perception Management"]
  }
}
```

## 7. Quality Governance (Task 7)
**The "Uncanny Valley" Check**:
1. Is the dialogue "Robotic"? (Reject if yes)
2. Does it feel like a textbook? (Reject if yes)
3. Would a main character in a movie say this? (Accept if yes)
4. Is there a rhythmic pulse to the writing? (Accept if yes)
