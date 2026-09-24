# Best Practices (Successes to Repeat)

- Co-locate component files: `MyComponent/index.tsx`, `MyComponent/MyComponent.test.tsx`, `MyComponent/MyComponent.module.scss`.
- Use `React.memo` only after profiling confirms a performance problem — premature optimisation adds complexity.
- Barrel exports (`index.ts`) per domain folder to keep import paths clean.
- Always define prop types with explicit interfaces, never inline type literals on the component signature.
- Prefer `const` arrow functions for components to ensure consistent hoisting behaviour.
- Use TanStack Query's `queryKey` arrays as the single source of truth for cache invalidation strategy.
- Start Storybook stories in parallel with component development, not after.
- DO not try to consolidate multiple pages on a single tsx rather generate the file structure similar to Data models, entities on the landing Site.
- **Enterprise Standards Alignment**: Default to React Admin for internal apps. Ensure all API consumption supports pagination, sorting, and filtering. Strictly enforce JWT Bearer token authentication logic in the frontend interceptors.
- **Testing**: Rely on React Testing Library with MSW for mocking, ensuring tests assert on accessible roles (`data-testid` only as fallback).
