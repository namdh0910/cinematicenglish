# Performance MCP | Speed Governance

## Goal
Maintain sub-second perceived load times and 60FPS interactions.

## Audit Criteria
1. **Render Cost**: Identify unnecessary re-renders in client components.
2. **Lazy Loading**: Ensure large components and images use `dynamic` or `loading="lazy"`.
3. **Bundle Size**: Monitor third-party library imports.
4. **Animation Cost**: Ensure all Framer Motion animations use `layoutId` or are GPU-accelerated.
5. **Asset Optimization**: Use `.webp` for images and compressed assets for video.

---

# SaaS Architecture MCP | Scalability Governance

## Goal
Ensure the codebase remains maintainable as the team and feature set grow.

## Audit Criteria
1. **Folder Separation**: Logic in `lib`, UI in `components`, data in `api/db`.
2. **State Management**: Favor URL state and Server Actions over complex Redux/Zustand unless necessary.
3. **API Integrity**: Ensure standardized response formats and error handling.
4. **Environment Safety**: Verify sensitive keys are in `.env` and never exposed to the client.
5. **Clean Code**: Follow the "Boy Scout Rule" (leave code cleaner than you found it).
