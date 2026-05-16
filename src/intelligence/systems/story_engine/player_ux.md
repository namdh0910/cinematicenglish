# Story Continuation Overlay | Premium UI

## Goal
To maintain emotional momentum while giving the user a sense of agency and progress.

## UI Components
1. **The Hero Hook**:
   - Typography: `Outfit`, Bold, 24px-32px.
   - Content: "The journey continues: [Next Story Title]"
2. **The "Why Continue" Subtext**:
   - A single sentence emotional teaser (e.g., *"Discover why silence is your greatest weapon."*).
3. **The Momentum Progress**:
   - Visual: A thin, glowing progress ring around the Play button.
   - Text: "Up Next in 5s..."
4. **The Reward Preview**:
   - A subtle icon showing: `+150 XP Mastery Reward` awaiting.
5. **The Control Group**:
   - Primary: Large "Continue Now" button (btn-gold).
   - Secondary: "Stop for today" (Ghost button).

## Visual Aesthetics
- **Background**: `bg-black/60` with a `backdrop-blur-xl`.
- **Glow**: A soft radial gradient matching the theme of the next story (e.g., Deep Blue for Philosophy, Amber for Business).
- **Motion**: The overlay should "breath" with a subtle `scale: [1, 1.01, 1]` animation.

---

# Continuous Story Player | Immersion Refactor

## Experience Design
The player is no longer a static component; it is an **"Atmosphere Container."**

1. **Ambient Continuity**: If the next story shares the same category, the background ambient loop persists through the transition.
2. **Progress Carry-over**: The session XP bar remains pinned to the bottom, showing the cumulative growth during this binge session.
3. **Immersive Transitions**:
   - **Glow Fade**: Instead of a black screen, use a blur-fade that feels like a camera lens changing focus.
   - **Text Morphing**: The title text morphs into the new title using Framer Motion `layoutId`.
4. **Mobile Navigation**:
   - **Double-Tap**: Skip 10s forward/backward.
   - **Swipe Left**: Reveal the queue.
   - **Swipe Down**: Minimize to "Mini-Player" mode.
