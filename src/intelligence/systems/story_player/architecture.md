# Immersive Story Player Architecture | The Cinematic Environment

## Core Philosophy
The player is not a tool; it is a **"Cinematic Environment"** where learning happens as a byproduct of emotional immersion.

## Layered Architecture
1. **Atmosphere Layer (Deepest)**:
   - Responsible for the dynamic background, cinematic glows, and mood-matching particle effects.
   - Reacts to the story's "Emotional Metadata."
2. **Audio Layer**:
   - High-fidelity narration + spatial ambient audio.
   - Handles the waveform generation and seamless looping of atmosphere sound.
3. **Transcript Layer (The Focus)**:
   - Sentence-by-sentence rendering.
   - Handles the "Active Sentence Glow" and word-level interaction.
4. **Interaction Layer (UI Overlay)**:
   - Minimalist controls (Play/Pause, Replay Sentence, Shadowing Toggle).
   - Disappears during "Focus Mode."
5. **Momentum Layer (The Hook)**:
   - Preloads the next story and manages the "Continuation Overlay."
6. **AI Assistance Layer (The Coach)**:
   - Real-time pronunciation feedback and context-aware word definitions.

## State Management
- **Synchronized Progress**: Audio timestamp, active sentence index, and user interaction state are synced in a shared context to ensure text and audio are perfectly locked.
- **Atmosphere State**: Mood tokens (e.g., `mood: 'melancholic'`) drive CSS variable updates for colors and blur levels.
