# Cinematic UI Skill | Design Patterns

## Core Aesthetic
A combination of **Netflix dark mode**, **Apple precision**, and **Modern Glassmorphism**.

## Reusable Patterns
1. **The Glass Card**:
   - `bg-white/5`
   - `backdrop-blur-md`
   - `border border-white/10`
   - `shadow-lg`
2. **The Cinematic Gradient**:
   - Primary: `bg-gradient-to-br from-violet-600 to-indigo-700`
   - Gold: `bg-gradient-to-r from-amber-400 to-orange-500`
3. **Typography Scaling**:
   - Display: `Outfit` (Bold, tracked tightly)
   - Body: `Inter` (Regular, 1.6 line height)
4. **Active States**:
   - Hover: `scale-[1.02]` + `brightness-110` + `shadow-glow`

## Implementation Guidance
- Use the `<Section>` wrapper for consistent vertical padding.
- Use the `<Badge>` component for all micro-labels.
- All "Premium" buttons should use the `btn-primary` or `btn-gold` utility classes.
