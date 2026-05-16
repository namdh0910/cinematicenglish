# Cinematic English — Design System Documentation

This document outlines the visual and architectural standards for the Cinematic English platform. It is designed to ensure consistency, scalability, and a premium "Apple-level" UX across all current and future pages.

## 1. Global Tokens (Design Variables)

All tokens are defined in `src/app/globals.css`.

### Colors
- **Backgrounds**: `--bg-primary` (#050508), `--bg-secondary` (#0a0a12).
- **Glass**: `--bg-glass` (transparent white), `--bg-glass-hover`.
- **Accents**: 
  - Gold: `--accent-gold` (#f5c842) - Used for achievement and premium features.
  - Violet: `--accent-violet` (#8b5cf6) - Core primary accent.
  - Cyan: `--accent-cyan` (#06b6d4) - Used for AI and coaching.
  - Emerald: `--accent-emerald` (#10b981) - Used for success and positive status.

### Typography
- **Primary Font**: `Inter` (UI, Body).
- **Display Font**: `Outfit` (Headlines, Hero).
- **Mono Font**: `JetBrains Mono` (Data, Phonetics).
- **Hero Scale**: `text-hero` (Clamp: 2.5rem - 5rem).
- **Display Scale**: `text-display` (Clamp: 1.75rem - 3rem).

### Spacing & Layout
- **Grid**: 8px base spacing system (`--space-1` to `--space-20`).
- **Container**: `container-custom` (max-width: 1280px).
- **Section Padding**: `section-padding` (5rem desktop, 3rem mobile).

---

## 2. Standardized Components

Located in `src/components/ui/`.

### Button
Standardized action element with built-in Framer Motion effects.
- **Variants**: `primary`, `gold`, `ghost`, `outline`.
- **Sizes**: `sm`, `md`, `lg`.

### Card
The core container for content, implementing glassmorphism and motion.
- **Props**: `hover` (boolean), `padding` (none, sm, md, lg).
- **Animation**: Fade-in-up on scroll with `whileInView`.

### Badge
Small labels for categories and status.
- **Variants**: `violet`, `gold`, `emerald`, `rose`, `outline`.

### Section
Wrapper for layout consistency.
- **Props**: `container` (boolean), `className`.

### Waveform
Reusable animated waveform for audio visualization.
- **Props**: `active` (boolean), `bars` (number), `height` (number).

---

## 3. Motion System (Framer Motion)

- **Page Transitions**: Suble slide-up and fade (`opacity: 0, y: 20` -> `opacity: 1, y: 0`).
- **Hover Transitions**: Standard `scale: 1.02` or `y: -2` for cards and buttons.
- **Tap Feedback**: `scale: 0.98` for all interactive elements.
- **Timings**: Standardized via `--transition-normal` (300ms) and `--transition-cinematic` (800ms).

---

## 4. Mobile Standards

- **Touch Targets**: Minimum 44x44px.
- **Font Scaling**: Handled via CSS `clamp()` and media queries.
- **Overflow**: Horizontal scrolling only for dedicated horizontal lists (e.g., categories).
- **Gestures**: Swipe-based navigation in the Feed and Chat selection.

---

## 5. Maintenance Rules for Future AI Agents

1. **Don't use hardcoded colors**: Always use `var(--color-name)`.
2. **Reuse UI Components**: Never build a new button or card from scratch. Modify `src/components/ui/` if a new variant is needed.
3. **Keep it Cinematic**: Use glassmorphism and subtle glows (`shadow-glow-violet`) for premium sections.
4. **Mobile First**: Always check layout on `max-width: 768px`.
5. **Localization**: Maintain Vietnamese translations in `src/lib/data.ts`.
