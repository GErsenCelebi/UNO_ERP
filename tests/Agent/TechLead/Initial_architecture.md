src/
├── api/          # API client instances (e.g., axiosConfig.ts)
├── components/   # Reusable UI components
├── features/     # Feature-based modules (e.g., users, todos)
│   ├── components/
│   ├── services/ # API calls specific to this feature
│   ├── types/    # TypeScript interfaces (Domain/DTO)
│   └── hooks/    # Custom hooks (e.g., useUsers.ts)
├── hooks/        # Global hooks
├── types/        # Global types
└── utils/        # Utility functions
