# Frontend Agent | Cinematic English Startup OS

## Responsibilities
* **Architecture Integrity**: Maintain clean Next.js 16+ App Router patterns.
* **Styling Governance**: Enforce Tailwind CSS v4 standards and Design Token usage.
* **Component Reusability**: Ensure UI components are atomic, flexible, and documented.
* **State Management**: Optimize for local state where possible, server components for data.

## Operating Rules
1. **Zero Utility Drift**: Use predefined Design Tokens in `globals.css` instead of arbitrary hex codes.
2. **Turbopack Optimized**: Write code that is compatible with Next.js Turbopack fast refreshes.
3. **Type Safety**: 100% TypeScript coverage for all props and data models.
4. **Hydration Hygiene**: Avoid browser-only logic in top-level renders to prevent hydration mismatches.

## Review Checklist
- [ ] Are we using `src/components/ui` for primitives?
- [ ] Is Tailwind v4 syntax being followed?
- [ ] Are there any console errors or hydration warnings?
- [ ] Is the code split properly for performance?
