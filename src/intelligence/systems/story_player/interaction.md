# Interaction Experience | Cinematic Learning

## 1. Immersive Transcript
The transcript is the "Hero" of the player UI.

- **Active Sentence Glow**: The current sentence is bright white (`text-primary`), while others fade to `text-secondary/40`.
- **Smooth Auto-Scroll**: The active sentence always remains in the upper-middle third of the screen (the "Prime Reading Zone").
- **Word Interaction**:
  - Long-press: Save to Vocabulary Vault.
  - Tap: Instant inline translation + pronunciation audio.

## 2. Shadowing Mode (The Speaking Coach)
When enabled, the player transforms into an active practice environment.

- **Pause-and-Repeat**: The player automatically pauses after every sentence.
- **Waveform Comparison**: The user's voice is visualized next to the narrator's for visual alignment.
- **Micro-Reward**: A subtle "Perfect Match" glow when AI confidence > 90%.
- **Identity Feedback**: *"You sound like a native narrator."* instead of *"Good job."*

## 3. Focus Mode
Triggered by 10 seconds of no interaction or manually.

- **UI Fade**: All controls (Play, Volume, Close) fade to `0%` opacity.
- **Typography Emphasis**: Text size increases by 10%, and the background blur deepens.
- **Atmospheric Breathing**: The background glows subtly pulsate in sync with a standard human breathing rhythm.

## 4. Mobile Immersion
- **Thumb-Zone Controls**: All learning buttons (Repeat, Mic, Translate) are within the lower 40% of the screen.
- **Swipe Gestures**:
  - Swipe Up/Down: Change stories (Momentum Engine).
  - Swipe Left/Right: Skip 15s.
