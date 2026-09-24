# architecture-principles.md

## Version

1.0

## Purpose

This document defines the default architecture principles for software applications delivered by the Agentic AI Software Delivery Team.

It should be used by:

- TechLead (Architect)
- Backend Developer
- Frontend Developer
- Frontend Designer
- E2E Test Manager
- Software Team Orchestrator

This document defines the **default architecture baseline**. Project-specific deviations are allowed only when justified and approved.

---

# 1. Default Technology Stack

Unless a project explicitly requires otherwise, the standard technology stack is:

## Backend

- **.NET Core 10**
- **ASP.NET Core Web API**
- **REST APIs**
- **Swagger / OpenAPI enabled**
- Visual Studio 2026 compatible solution structure

## IDE / Development Environment

- **Visual Studio 2026**
- Local development should work easily from Visual Studio
- Projects should be runnable locally with minimal setup

## Frontend

Frontend technology may vary by project.

Default frontend options:

- **React Admin** for standard admin CRUD applications
- React or Angular for custom frontend applications
- Other frontend frameworks only when justified

## Testing

- **Playwright** for E2E test automation
- Unit tests for backend services
- API tests where applicable
- Local test execution must be simple and repeatable

## Deployment

Primary deployment method:

- **Visual Studio 2026 Publish**

The solution must be structured so that it can be deployed easily using Visual Studio Publish unless a different deployment model is explicitly approved.

---

# 2. Architecture Decision Principle

Use the simplest architecture that satisfies the business need.

Default decision:

```text
Simple Admin CRUD Application
        │
        ▼
React Admin + REST APIs + Swagger + .NET Core 10
```

Only introduce advanced architecture when required by:

- high user volume
- complex business workflows
- scaling needs
- integration complexity
- security requirements
- performance requirements
- long-term product roadmap

Avoid over-engineering.

---

# 3. Default Application Architecture

The default application structure should be:

```text
Frontend
  React Admin / React / Angular

Backend
  ASP.NET Core Web API

API Documentation
  Swagger / OpenAPI

Database
  SQL Server or approved relational database

Testing
  Playwright E2E Tests

Deployment
  Visual Studio 2026 Publish
```

---

# 4. Solution Structure

The solution should be easy to:

- open in Visual Studio 2026
- run locally
- test locally
- publish from Visual Studio
- understand by another developer
- extend safely

Recommended structure:

```text
/src
  /Backend
    /Api
    /Application
    /Domain
    /Infrastructure

  /Frontend
    /admin-ui
    /custom-ui

/tests
  /Backend.UnitTests
  /Backend.IntegrationTests
  /E2E.Playwright

/docs
  architecture.md
  api.md
  deployment.md
  local-setup.md
```

For small projects, this can be simplified.

For example:

```text
/src
  /Api
  /Frontend

/tests
  /E2E.Playwright

/docs
```

---

# 5. Backend Architecture Principles

The backend should expose clean REST APIs.

Backend must provide:

- REST endpoints
- Swagger documentation
- clear routing
- DTOs for requests and responses
- validation
- error handling
- logging
- configuration separation
- local development support

Backend should avoid:

- business logic inside controllers
- hardcoded configuration
- direct database access from API controllers
- undocumented endpoints
- APIs that cannot be tested through Swagger

---

# 6. API Principles

All backend APIs must be reachable and testable through Swagger.

Swagger should include:

- endpoint list
- request models
- response models
- status codes
- authentication requirements where applicable
- error response examples where practical

API design should be:

- simple
- consistent
- RESTful
- frontend-friendly
- testable
- documented

---

# 7. Frontend Architecture Principles

Frontend selection depends on project needs.

## Default Admin CRUD Pattern

For simple internal admin systems, use:

```text
React Admin
        +
REST APIs
        +
Swagger
        +
.NET Core 10 Backend
```

This is preferred when the application mainly requires:

- list views
- create/edit/delete screens
- search
- filtering
- simple role-based access
- standard admin operations

## Custom Frontend Pattern

Use custom React or Angular when the application requires:

- complex UX
- customer-facing UI
- advanced workflows
- dashboards
- custom visual design
- complex state management
- high interaction density

## High-Scale Frontend Pattern

For high-volume or highly scalable applications, perform an architecture review before selecting the frontend approach.

Consider:

- performance budget
- caching
- CDN
- API load
- bundle size
- rendering strategy
- authentication flow
- observability

---

# 8. Local Development Principle

Every solution must be easy to run locally.

A developer should be able to:

- open the solution in Visual Studio 2026
- run backend locally
- open Swagger locally
- run frontend locally
- execute Playwright tests locally
- publish using Visual Studio Publish

Required documentation:

```text
/docs/local-setup.md
/docs/deployment.md
```

---

# 9. Deployment Principle

Primary deployment approach is:

```text
Visual Studio 2026 Publish
```

The application should be structured to support this by default.

Deployment should include:

- backend publish profile
- frontend build instructions
- environment configuration
- database migration guidance
- post-deployment verification
- rollback notes where applicable

Advanced deployment options such as CI/CD, containers, Kubernetes, or cloud-native deployment may be used only when the project requires them.

---

# 10. Testing Architecture

Testing must be part of the architecture.

Default testing stack:

```text
Backend Unit Tests
Backend Integration Tests
Playwright E2E Tests
```

Playwright should validate:

- login
- navigation
- CRUD flows
- form validation
- API-driven UI behavior
- critical user journeys

E2E tests should be runnable locally and in CI when available.

---

# 11. Swagger Validation Principle

Before frontend development starts, backend APIs should be validated through Swagger.

Minimum API readiness:

- endpoints visible in Swagger
- request/response models correct
- basic success response verified
- error responses defined
- authentication behavior understood

Frontend developers should not depend on undocumented APIs.

---

# 12. Architecture Approval

The TechLead (Architect) prepares the architecture recommendation.

Human approval is required for:

- architecture baseline
- frontend technology choice
- backend structure
- deployment approach
- deviations from default stack

Sprint 0 cannot close until architecture approval is completed.

---

# 13. Default Architecture Decision Tree

```text
Is this mainly an internal Admin CRUD application?
        │
        ├── Yes
        │     ▼
        │   Use React Admin + REST APIs + Swagger + .NET Core 10
        │
        └── No
              │
              ▼
Is custom UX or customer-facing UI required?
        │
        ├── Yes
        │     ▼
        │   Use React or Angular with architecture review
        │
        └── No
              │
              ▼
Use simple frontend + REST APIs unless stronger requirements exist
```

---

# 14. Simplicity Rule

Do not introduce:

- microservices
- event-driven architecture
- Kubernetes
- service mesh
- complex frontend state management
- CQRS
- event sourcing

unless there is a clear business or technical reason.

Default is simple, maintainable, deployable software.

---

# 15. When to Use Microservices

Microservices may be considered only when:

- multiple teams need independent ownership
- independent deployment is required
- domains are clearly separated
- scaling needs differ by domain
- integration complexity justifies separation
- operational maturity exists

Otherwise prefer:

```text
Modular Monolith
        or
Single ASP.NET Core Web API
```

---

# 16. Recommended Default Architecture

For most small-to-medium applications:

```text
React Admin Frontend
        │
        ▼
ASP.NET Core 10 REST API
        │
        ▼
SQL Server
        │
        ▼
Visual Studio 2026 Publish
```

With:

- Swagger enabled
- Playwright E2E tests
- simple local setup
- clear solution structure
- documented deployment steps

---

# 17. Architecture Quality Gates

Architecture is acceptable when:

- solution opens cleanly in Visual Studio 2026
- backend runs locally
- Swagger works locally
- frontend runs locally
- Playwright tests can run locally
- deployment through Visual Studio Publish is supported
- configuration is externalized
- APIs are documented
- project structure is understandable
- no unnecessary architecture complexity exists

---

# 18. Documentation Requirements

Minimum documentation:

```text
/docs/architecture.md
/docs/local-setup.md
/docs/api.md
/docs/deployment.md
/docs/testing.md
```

Documentation should explain:

- how to run locally
- how to test locally
- how to publish
- how APIs are structured
- how frontend connects to backend
- known assumptions
- known limitations

---

# 19. Code Review Architecture Checklist

During code review, verify:

- architecture boundaries respected
- controllers are thin
- business logic is not duplicated
- APIs match Swagger
- frontend uses documented APIs
- tests cover key flows
- configuration is not hardcoded
- solution remains easy to publish
- no unnecessary complexity introduced

---

# 20. Final Architecture Principle

The default target is:

```text
Simple to understand
Simple to run locally
Simple to test
Simple to publish
Simple to maintain
```

Enterprise architecture does not mean complex architecture.

The preferred architecture is the simplest reliable architecture that delivers the business goal using:

```text
.NET Core 10
Visual Studio 2026
REST APIs
Swagger
React Admin by default for Admin CRUD
Playwright for E2E testing
Visual Studio Publish for deployment
```