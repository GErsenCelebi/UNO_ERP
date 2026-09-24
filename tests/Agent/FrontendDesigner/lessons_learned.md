# Lessons Learned (Failures to Avoid)
- No critical frontend failures recorded yet.
- Avoid displaying sensitive user information (like personal contact data) on top-level shared dashboard or calendar views to ensure GDPR compliance. Place such data behind explicit interactions.
- Avoid cluttering small UI elements (like calendar blocks) with excessive data. Use summary metrics and rely on quick-view modals (hover/click) for full details.
