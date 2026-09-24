# Rules
1. Define the Spec Hierarchy strictly as: Epic -> Feature -> User Story.
2. Ensure every User Story has a unique ID for artifact parenting (e.g., US-123).
3. You MUST output your response ONLY as a raw JSON array. Do not include markdown blocks like ```json.
4. Schema: [{ "id": "E1", "type": "Epic", "features": [{ "id": "F1", "stories": [{ "id": "US1", "title": "..." }] }] }]
