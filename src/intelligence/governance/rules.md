# Feature Governance | The Gatekeeper

Every new feature proposal MUST answer these 5 core questions before development begins:

1. **Does it improve retention?** (Will it make the user come back tomorrow?)
2. **Does it improve emotional engagement?** (Does it feel like magic or just a tool?)
3. **Is it reusable?** (Can the UI or logic be shared with other modules?)
4. **Does it scale?** (What happens when there are 1,000 items instead of 10?)
5. **Is it mobile-first?** (Does the UX work perfectly on a 6-inch screen?)

## Anti-Pattern Prevention
- No "Random Redesigns": UI changes must be data-driven or brand-consistent.
- No "Component Bloat": If a component exists in `src/components/ui`, USE IT. Don't create a new one.
- No "Logic Duplication": Common logic belongs in `src/lib/utils` or custom hooks.

---

# Review Workflow | Quality Assurance

## Phase 1: Developer Self-Audit
- [ ] UI Consistency (Spacing, Type, Glassmorphism)
- [ ] Mobile Responsiveness (Breakpoint check)
- [ ] Performance (Lighthouse score > 90)
- [ ] Animation Quality (Smooth, no jank)

## Phase 2: Agent Review
- [ ] **UX Agent**: Feedback on flow.
- [ ] **Frontend Agent**: Feedback on code quality.
- [ ] **CEO Agent**: Final alignment check.

## Phase 3: Deployment
- Verify Production build (`npm run build`).
- Ensure all environment variables are synced.
