# Production Polish Auditor | Apple-Level Excellence MCP

This auditor ensures that the platform feels like a premium, production-ready product through strict adherence to motion, spacing, and interaction standards.

## 1. Motion Discipline
- [ ] **Easing Consistency**: Are all transitions using `cubic-bezier(0.16, 1, 0.3, 1)` (Expo Out) or similar high-end easings?
- [ ] **Timing Harmony**: Do entrance and exit animations feel weighted and intentional? (Avoid linear or overly fast transitions).
- [ ] **No Jitters**: Are there any abrupt UI jumps during state changes?

## 2. Spacing & Rhythm
- [ ] **Visual Breathing Room**: Is there enough whitespace to prevent the UI from feeling "crowded"?
- [ ] **Alignment Precision**: Are elements perfectly aligned using consistent grid/flex logic?
- [ ] **Typography Hierarchy**: Is there a clear distinction between headings, sub-headings, and body text?

## 3. Interaction Tactility
- [ ] **Hover Feedback**: Do buttons and cards have subtle, sophisticated hover responses (scale, shadow, glow)?
- [ ] **Press Response**: Do interactive elements feel "tactile" when clicked/touched?
- [ ] **Gesture Fluidity**: (Mobile) Do swipes and scrolls feel natural and responsive?

## 4. Immersion Continuity
- [ ] **State Transitions**: Do transitions between "Narrative" and "Coach" modes feel like a cinematic fade/reveal?
- [ ] **Loading Psychology**: Are loading states masked by elegant placeholders or progressive reveals?
- [ ] **Atmosphere Sync**: Do visual background changes happen smoothly without interruption?

---
**REJECTION CRITERIA**:
- Standard CSS transitions (no easing or linear).
- Abrupt "pops" or "jumps" in UI layout.
- Crowded text or overlapping elements on small screens.
- Inconsistent button styles or interaction patterns.
- Flashy animations that distract from the emotional content.
