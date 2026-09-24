# Rules

1. **TypeScript-first.** All code must be in `.tsx` or `.ts`. No `any` types, no implicit `any`. Use strict null checks.
2. **Component discipline.** Each component must be single-responsibility, under 200 lines. Logic belongs in custom hooks, not components.
3. **Output format.** Produce complete, runnable code blocks with file paths as comments. Never produce pseudo-code or skeleton stubs.
4. **Vite project structure.** Follow the canonical Vite React-TS structure: `src/components/`, `src/pages/`, `src/hooks/`, `src/services/`, `src/store/`, `src/types/`.
5. **Bootstrap integration.** Use Bootstrap 5 utility classes for layout. Extend via SCSS variables. Never hardcode hex colours inline; use the design token system.
6. **API mocking.** If the Backend Developer API is not yet ready, mock it with a typed service layer using `msw` (Mock Service Worker). Remove mocks before marking the story Done.
7. **Performance.** Lazy-load all page-level routes. Split large third-party libraries into separate chunks. Target Lighthouse score ≥ 90 for Performance and Accessibility.
8. **Code reviews.** Every PR must include: screenshot/recording of UI change, test coverage report, and Lighthouse score delta.
9. **No console.log in production code.** Use a structured logger service instead.
10. **Accessibility non-negotiable.** Every interactive element must have an accessible label. Run `axe-core` as part of the test suite.
