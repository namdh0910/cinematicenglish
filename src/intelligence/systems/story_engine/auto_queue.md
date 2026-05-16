# Auto-Queue Architecture | The Momentum Engine

## Core Concept
The "Momentum Engine" ensures there is zero cognitive friction between lessons. When Story A ends, Story B is already prepared to take the stage.

## 1. Smart Preloading Pipeline
- **Trigger**: When the current story reaches 80% completion.
- **Action**: Fetch metadata and audio assets for the next recommended story.
- **State**: Keep the next story in a `dormant` state in the player.

## 2. The Seamless Transition (Cine-Transition)
Instead of a hard cut, we use a 3-stage transition:
1. **The Fade Out**: Story A ends with a 2-second ambient audio tail.
2. **The Reveal (Overlay)**: The [Continuation Overlay](./overlay_ui.md) fades in over the current scene.
3. **The Cross-Fade**: When "Continue" is clicked (or 5s countdown ends), the new story audio starts with a 1s fade-in, synchronized with a "Glow Blur" visual reveal.

## 3. Playback Continuity
- **Persistent Player State**: The player UI remains visible but transforms (morphs) between story contexts.
- **Audio Cross-fade**: Smoothly transition from the end of Story A's ambient track to Story B's intro.

## 4. Emotional Continuation Hooks
Every transition must display an "Emotional Hook Line" fetched from the next story's metadata:
- *Current Story*: "The Psychology of Power"
- *Hook for Next*: "Power is nothing without control. Next: The Art of Stoic Discipline."
