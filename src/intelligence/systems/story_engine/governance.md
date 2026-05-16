# Story Engine Governance | Ethics & Analytics

## 1. Ethical Autoplay Boundaries
To prevent user fatigue and "Dark Pattern" addiction:
- **The "Are you still learning?" Check**: After 4 consecutive stories, the autoplay pauses and asks: *"This has been a powerful session. Would you like to save your progress now or continue for one more?"*
- **Natural Pausing**: If the app detects zero interaction (e.g., no shadowing, no word saves) during a story, it will NOT autoplay the next one.
- **Sleep Protection**: Autoplay is disabled between 12 AM and 5 AM unless the user manually clicks "Next."

## 2. Retention Analytics (Binge Metrics)
We track "Binge Quality" rather than just "Binge Quantity":
- **Chain Depth**: Average number of stories completed per session.
- **Autoplay Conversion**: % of users who let the countdown finish vs. clicking "Continue" vs. clicking "Stop."
- **Emotional Drop-off**: Identifying specific story transitions where users tend to quit (indicates a mismatch in recommendation logic).
- **Shadowing Completion Rate**: Ensuring binge-learning doesn't lead to passive listening without active speaking practice.

## 3. Future Dashboard KPI
- **Momentum Index**: A weighted score of Completion Rate + Session Depth + Next-Day Return Rate.
