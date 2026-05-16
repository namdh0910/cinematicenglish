# Atmosphere System | Emotional Immersion

## Goal
To create a background that "breathes" with the story, reducing cognitive load and increasing emotional depth.

## Atmosphere Modes
1. **The Void (Default/Philosophy)**:
   - Base: `#050508`
   - Accents: Deep Violet glows (`shadow-glow-violet`).
   - Effect: Subtle floating particles (CSS keyframe animation).
2. **The Pulse (High Intensity/Business)**:
   - Base: `#0d0d18`
   - Accents: Amber/Gold glows.
   - Effect: Soft grain texture overlay with a breathing opacity.
3. **The Calm (Daily Life/Storytelling)**:
   - Base: `#0a0a0f`
   - Accents: Cyan/Soft Blue glows.
   - Effect: Slow-moving radial gradients that morph over time.

## Cinematic Micro-details
- **Glow Fades**: When the story mood changes, the background color transitions over 3 seconds using `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Motion Grain**: A very subtle `opacity-5` film grain effect to give it a "Cinema" feel.
- **Dynamic Blur**: During "Focus Mode," the background blur increases from `12px` to `24px` to pull the user deeper into the text.
