# coding-standards.md

---
title: Coding Standards
version: 1.0
status: Approved
owner: TechLead (Architect)
reviewers:
  - Software Team Orchestrator
  - Backend Developer
  - Frontend Developer
last_updated: YYYY-MM-DD
---

# Purpose

This document defines the coding standards used by all software projects delivered by the Agentic AI Software Delivery Team.

It provides a common engineering standard regardless of project size.

The primary objectives are:

- Readability
- Maintainability
- Testability
- Security
- Performance
- Consistency

This document applies to:

- .NET Core 10
- ASP.NET Core Web APIs
- React
- Angular
- TypeScript
- SQL
- Playwright Tests

---

# 1. General Principles

Every line of code should be:

- Simple
- Readable
- Predictable
- Testable
- Maintainable

Code is written once but read many times.

Optimize for readability.

---

# 2. Simplicity

Prefer:

- simple methods
- simple classes
- simple components
- small services

Avoid unnecessary:

- abstractions
- inheritance
- generics
- design patterns
- frameworks

Every additional layer must have clear value.

---

# 3. SOLID Principles

Every implementation should follow SOLID whenever appropriate.

- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

---

# 4. Clean Code

Avoid:

- duplicated code
- nested logic
- magic numbers
- hardcoded values
- dead code
- commented-out code
- unclear naming

Prefer:

- early return
- guard clauses
- descriptive names
- small methods

---

# 5. Naming Standards

Names should describe intent.

Good examples:

```text
CustomerRepository

InvoiceService

CreateBookingCommand

CalculateDiscount()

IsUserAuthorized
```

Avoid:

```text
Helper

Manager

Data

Temp

Stuff

Obj

Value1
```

Booleans should read naturally:

```csharp
IsActive

HasPermission

CanDelete

ShouldRetry
```

---

# 6. Method Standards

Methods should:

- perform one responsibility
- be short
- avoid side effects
- be easily testable

Preferred size:

20–40 lines

Review methods exceeding 80 lines.

---

# 7. Class Standards

Classes should:

- represent one concept
- be cohesive
- hide implementation details
- expose clear interfaces

Review classes larger than ~500 lines.

---

# 8. Controller Standards (.NET)

Controllers should only:

- receive requests
- validate models
- call application services
- return responses

Controllers should **not** contain:

- business rules
- SQL
- calculations
- complex logic

---

# 9. Service Standards

Business logic belongs in services or domain models.

Services should:

- be reusable
- be testable
- avoid infrastructure concerns

---

# 10. Repository Standards

Repositories should:

- encapsulate persistence
- hide ORM details
- expose business-oriented methods

Avoid business logic inside repositories.

---

# 11. DTO Standards

Expose DTOs rather than domain entities.

Separate:

- Request DTOs
- Response DTOs
- Domain Models
- Database Entities

Never expose database entities directly through APIs.

---

# 12. Exception Handling

Exceptions should represent exceptional situations.

Do not use exceptions for normal control flow.

Every exception should:

- provide meaningful information
- preserve stack trace
- be logged appropriately

---

# 13. Logging

Log:

- business failures
- unexpected exceptions
- important state transitions

Avoid logging:

- passwords
- tokens
- secrets
- personal data unless required

Structured logging is preferred.

---

# 14. Async Programming

Prefer async/await for:

- database access
- HTTP requests
- file operations
- messaging

Avoid blocking asynchronous code.

Do not mix synchronous and asynchronous implementations unnecessarily.

---

# 15. Dependency Injection

All dependencies should be injected.

Avoid:

```csharp
new Repository()

new HttpClient()
```

inside business logic.

---

# 16. Configuration

Configuration should never be hardcoded.

Use:

- appsettings
- environment variables
- secure configuration providers

Secrets belong in secure secret storage.

---

# 17. Validation

Validate:

- API requests
- user input
- business rules

Validation should occur as early as practical.

---

# 18. Null Handling

Avoid NullReferenceExceptions.

Prefer:

- nullable reference types
- guard clauses
- defensive programming

Never ignore compiler nullability warnings.

---

# 19. Error Messages

Error messages should:

- be meaningful
- be actionable
- avoid exposing internal implementation

---

# 20. Comments

Good code rarely requires comments.

Use comments for:

- business rules
- unusual algorithms
- architectural decisions

Avoid explaining obvious code.

---

# 21. Regions

Avoid excessive use of:

```csharp
#region
```

Large regions usually indicate classes that should be refactored.

---

# 22. Constants

Avoid magic values.

Instead of:

```csharp
if(status == 4)
```

Prefer:

```csharp
if(status == OrderStatus.Completed)
```

---

# 23. Enums

Use enums where appropriate.

Prefer meaningful names.

Avoid numeric comparisons.

---

# 24. Frontend Standards

Frontend should emphasize:

- reusable components
- accessibility
- responsive design
- predictable state

Avoid duplicated UI logic.

---

# 25. React Standards

Prefer:

- Functional Components
- Hooks
- Composition
- Reusable Components

Avoid:

- large components
- deeply nested state
- duplicated logic

React Admin should be the default framework for internal CRUD applications unless project requirements dictate otherwise.

---

# 26. Angular Standards

Use:

- Standalone Components (where appropriate)
- Lazy Loading
- Strong typing
- Observable best practices

Avoid unnecessary complexity.

---

# 27. TypeScript Standards

Enable strict mode.

Avoid:

```typescript
any
```

Prefer explicit types.

Use interfaces for contracts.

---

# 28. SQL Standards

Use:

- parameterized queries
- indexes appropriately
- meaningful object names

Avoid:

- SELECT *
- dynamic SQL unless necessary

---

# 29. API Standards

REST APIs should:

- be documented in Swagger
- return appropriate status codes
- use consistent naming
- return predictable payloads

---

# 30. Testability

Every implementation should be testable.

Avoid tightly coupled code.

Use dependency injection.

Design for unit testing.

---

# 31. Unit Tests

Every business rule should have unit tests.

Tests should be:

- deterministic
- isolated
- repeatable

---

# 32. Playwright

Playwright is the standard E2E framework.

Critical user journeys should always be automated.

Examples:

- Login
- CRUD
- Search
- Navigation
- Authorization
- Validation

---

# 33. Code Formatting

Use:

- EditorConfig
- Prettier (frontend)
- dotnet format (backend)

Formatting should be automated.

---

# 34. Static Analysis

Every Pull Request should pass:

- compiler warnings
- analyzers
- linting
- formatting

Warnings should be treated as defects whenever practical.

---

# 35. Security

Never:

- expose secrets
- trust user input
- concatenate SQL
- disable authentication
- bypass authorization

Always validate external input.

---

# 36. Performance

Optimize only after measurement.

Prefer:

- efficient queries
- pagination
- caching where appropriate
- lazy loading
- batching

Avoid premature optimization.

---

# 37. Documentation

Public classes should include meaningful documentation where appropriate.

APIs should always be documented through Swagger.

Complex business logic should include rationale.

---

# 38. Git Standards

Every commit should:

- compile
- pass tests
- be meaningful

Commit messages should clearly describe intent.

Example:

```text
Add booking validation

Fix invoice calculation

Implement customer search
```

Avoid:

```text
fix

update

changes

test
```

---

# 39. Pull Requests

PRs should be:

- small
- reviewable
- linked to GitHub Issues

Include:

- summary
- testing performed
- screenshots (UI)
- deployment considerations

---

# 40. Code Review Checklist

Review:

- readability
- architecture
- SOLID
- security
- performance
- tests
- documentation
- duplication
- naming
- complexity

---

# 41. AI Generated Code

AI-generated code follows exactly the same standards.

Never merge AI-generated code without:

- review
- testing
- understanding

Humans remain accountable.

---

# 42. Final Principle

Every engineer should leave the codebase in a better state than they found it.

The goal is not clever code.

The goal is software that another engineer can understand, test, extend, and maintain years later.

Good software is simple software.