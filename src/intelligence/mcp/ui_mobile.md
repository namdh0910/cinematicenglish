# UI Critic MCP | Visual Governance

## Goal
Enforce the "Premium Cinematic" aesthetic and visual clarity.

## Audit Criteria
1. **Spacing (8px Grid)**: Are elements aligned to an 8px base? No "odd" pixel gaps.
2. **Hierarchy**: Is there a clear H1 -> H2 -> H3 progression?
3. **Glassmorphism Quality**:
   - Background blur: `12px` to `20px`
   - Border: `1px solid rgba(255,255,255,0.1)`
   - Shadow: Subtle glow matching the accent color.
4. **Contrast**: Ensure all text meets WCAG AA standards against dark backgrounds.
5. **Color Harmony**: Validate that violet/gold/cyan accents are used sparingly for impact.

---

# Mobile UX MCP | Ergonomic Governance

## Goal
Ensure the app is usable with one thumb while commuting (the primary learning use case).

## Audit Criteria
1. **Thumb-Zone Check**: Are critical buttons (Play, Next, Submit) within the lower 40% of the screen?
2. **Target Size**: Minimum touch target of 44x44px.
3. **Horizontal Scroll**: Avoid accidental horizontal scrolling (overflow-x).
4. **Mobile Navigation**: Is the mobile menu accessible and intuitive?
5. **Keyboard Handling**: Does the UI resize correctly when the virtual keyboard appears?
