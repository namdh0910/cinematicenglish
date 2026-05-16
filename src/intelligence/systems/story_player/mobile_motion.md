# Motion & Micro-details | The Premium Polish

## 1. Cinematic Motion Behavior
All player animations follow the **Motion Agent** standards (`cubic-bezier(0.22, 1, 0.36, 1)`).

- **Reveal Timing**: UI elements reveal themselves with a staggered 50ms delay, creating a sense of "Unfolding."
- **Focus Transition**: Transitioning into Focus Mode takes exactly 1200ms — a slow, deliberate fade that signals "Deep Immersion."
- **Transcript Scrolling**: Use "Spring Physics" for auto-scrolling to make it feel natural and weighted, not robotic.

## 2. Emotional Micro-interactions
- **Breathing Glow**: The active sentence has a very subtle pulse in its glow intensity (0.9 to 1.0 opacity).
- **Progress Warmth**: As the user nears the end of a story, the progress bar's color subtly shifts from Violet to Gold.
- **Completion Glow**: When the story finishes, a radial light source "explodes" softly from the center of the screen before fading to the Continuation Overlay.

## 3. Scaling the Player
The player is built as a **Controlled Environment**:
- It can be embedded in the `/stories` list (mini-player) or launched full-screen.
- It uses a centralized "Player Store" (e.g., Zustand) to sync state across the app.
- All assets (Audio/Text) are pre-fetched based on the [Recommendation Engine](../story_engine/recommendation_logic.md).
