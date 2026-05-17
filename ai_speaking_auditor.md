# AI Speaking Auditor Guidelines (Phase 3)

Establishing governance rules and quality checklists for the Cinematic English AI Speaking and Pronunciation Intelligence pipeline.

---

## ⚖️ 1. Core Evaluation Principles

To avoid traditional, discouraging exam engines that display harsh red marks and score explosions, Cinematic English enforces a supportive, identity-driven growth environment:

1. **Non-Toxic Scoring**: Avoid score shaming. A low pronunciation accuracy score must be paired with supportive, calm, actionable feedback (e.g. *"Great cadence. Let's focus on connecting the final 's' sounds in your next story walkthrough."*).
2. **Growth Mindset Framing**: Scores should show **progression** and **evolution** over time. Never label a student's accent as "incorrect"; highlight it as "evolving".
3. **Prevent Over-Correction Fatigue**: Do not flag every micro-error in a single reading. Highlight a maximum of **2 actionable focus areas** (e.g., specific phoneme clusters like `θ` or `ʃ`) per attempt to avoid discouraging the learner.

---

## 🛠️ 2. Auditing Checklist for Developers & Models

| Checkpoint | Target Standard | Auditor Action on Failure |
| :--- | :--- | :--- |
| **Whisper Output Mapping** | Word timestamps must map to pause detection without flagging natural pauses as hesitation. | Adjust gap threshold parameters in `SpeakingIntelligenceAnalyzer.ts`. |
| **Phoneme Grade Calibration** | Ensure standard dialects (UK/US) do not penalize regional neutral accents. | Add tolerance buffers to match rates. |
| **AI Coach Tone** | Tone must remain calm, intelligent, precise, and emotionally supportive. | Flag and strip cheap gamified praise strings (e.g., "Amazing!!!", "Super!"). |
