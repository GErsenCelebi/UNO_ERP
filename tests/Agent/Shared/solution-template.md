---
title: Enterprise Solution Template
document: solution-template.md
version: 1.0
status: Approved
owner: TechLead (Architect)
reviewers:
  - Software Team Orchestrator
  - Product Owner
  - Scrum Master
---

# Enterprise Solution Template

## Purpose

This document defines the **default solution template** used by the Agentic AI Software Delivery Team.

Unless a project explicitly requires another architecture, every new project should start from this template.

The objective is to provide:

- Fast project startup
- Consistent architecture
- Easy local development
- Simple deployment
- Built-in testing
- Low maintenance cost
- Standardized project structure

---

# 1. Default Technology Stack

## Backend

- ASP.NET Core 10 Web API
- REST APIs
- Swagger / OpenAPI
- Entity Framework Core
- SQL Server

---

## IDE

Visual Studio 2026

The complete solution should open and run without additional configuration.

---

## Frontend

### Default

React Admin

Used for:

- Admin Portals
- Internal Applications
- CRUD Systems
- Reporting
- Configuration

---

### Alternative

React

Use when:

- Customer-facing UI
- Complex workflows
- Rich UX

---

### Alternative

Angular

Use when:

- Enterprise applications
- Existing Angular ecosystem
- Project requirement

---

## Database

Default:

SQL Server

Alternatives require approval.

---

## Testing

Backend

- xUnit
- FluentAssertions

Frontend

- React Testing Library
- Angular Testing utilities

End-to-End

Playwright

---

## Documentation

Swagger

Every API must be documented.

---

## Deployment

Default deployment:

Visual Studio 2026 Publish

CI/CD pipelines are optional and project-dependent.

---

# 2. Solution Structure

```
Solution

│

├── src

│   ├── Backend

│   │      Api

│   │      Application

│   │      Domain

│   │      Infrastructure

│   │

│   ├── Frontend

│   │      Admin

│   │      CustomerPortal

│   │

│   └── Shared

│

├── tests

│   ├── Backend.UnitTests

│   ├── Backend.IntegrationTests

│   ├── Frontend.Tests

│   └── Playwright

│

├── docs

│

└── deployment
```

---

# 3. Backend Project Structure

```
Backend

│

├── Api

├── Controllers

├── Middleware

├── Configuration

├── Application

│      Services

│      DTOs

│      Validators

│

├── Domain

│      Entities

│      Interfaces

│      Events

│

├── Infrastructure

│      Persistence

│      Repositories

│      ExternalServices

│

└── Shared
```

---

# 4. Frontend Project Structure

```
Frontend

│

├── Pages

├── Components

├── Layouts

├── Hooks

├── Services

├── Models

├── Utilities

├── Assets

├── Styles

└── Configuration
```

---

# 5. Test Structure

```
tests

│

├── Backend.UnitTests

├── Backend.IntegrationTests

├── Frontend.Tests

├── Playwright

│      Login

│      CRUD

│      Search

│      Navigation

│      Authorization
```

---

# 6. Documentation Structure

```
docs

│

├── architecture.md

├── api.md

├── deployment.md

├── local-setup.md

├── testing.md

├── release-notes.md

└── known-limitations.md
```

---

# 7. Configuration Structure

Every environment should support:

```
Development

Test

QA

Staging

Production
```

Configuration should be externalized.

Never hardcode:

- passwords
- API keys
- connection strings

---

# 8. Swagger

Swagger must be enabled by default.

Swagger should include:

- Authentication
- All endpoints
- Request models
- Response models
- Status codes

Swagger should be reachable locally.

Example:

```
https://localhost:5001/swagger
```

---

# 9. Local Development

A new developer should be able to:

Open Visual Studio

↓

Restore Packages

↓

Run Backend

↓

Open Swagger

↓

Run Frontend

↓

Execute Playwright

Without manual configuration.

---

# 10. Default CRUD Pattern

For standard applications use:

```
React Admin

↓

REST API

↓

Swagger

↓

SQL Server
```

Every CRUD page should include:

- Search
- Sorting
- Pagination
- Create
- Edit
- Delete
- Validation
- Authorization

---

# 11. REST API Pattern

Every entity should support:

```
GET

GET by ID

POST

PUT

DELETE
```

Optional

```
PATCH

Bulk operations

Import

Export
```

---

# 12. Error Handling

Standard API response:

```
Success

↓

Data

↓

Metadata
```

Standard error response:

```
CorrelationId

ErrorCode

Message

Details
```

---

# 13. Logging

Logging should support:

- Information
- Warning
- Error

Structured logging preferred.

---

# 14. Authentication

Default:

JWT

Future alternatives:

- Azure AD
- OAuth2
- OpenID Connect

---

# 15. Authorization

Support:

- Roles

- Policies

- Claims

Authorization should be enforced server-side.

---

# 16. Database

Every table should include where applicable:

```
Id

CreatedDate

CreatedBy

ModifiedDate

ModifiedBy

IsDeleted
```

Soft delete preferred unless business requires physical deletion.

---

# 17. Repository Pattern

Repositories expose:

```
Get

Find

Add

Update

Delete
```

Business logic belongs in services.

---

# 18. Dependency Injection

Everything should be registered through DI.

Avoid direct object creation inside business logic.

---

# 19. Validation

Validation layers:

```
Frontend

↓

Backend

↓

Database
```

Never rely solely on frontend validation.

---

# 20. Testing Strategy

Minimum expectations:

Backend

✔ Unit Tests

Frontend

✔ Component Tests

System

✔ Playwright

---

# 21. Playwright

Every solution should automate:

Login

Navigation

CRUD

Validation

Authorization

Critical Business Flow

---

# 22. Publish

Primary deployment:

Visual Studio Publish

Publish profile should exist.

Example:

```
Properties

PublishProfiles
```

---

# 23. Folder Naming

Use:

PascalCase

Avoid:

```
misc

temp

newfolder

test123
```

---

# 24. GitHub

Every project should contain:

Issues

Milestones

Labels

Project Board

README

LICENSE (if required)

Release Notes

---

# 25. README

Minimum README:

Project

Purpose

Technology

How to Run

How to Test

How to Publish

Known Limitations

---

# 26. Default Quality Gates

Before merge:

✔ Builds

✔ Unit Tests

✔ Playwright

✔ Swagger works

✔ Documentation updated

✔ Code Review completed

---

# 27. Default Architecture Decision

Unless specified otherwise:

```
React Admin

↓

REST API

↓

Swagger

↓

.NET Core 10

↓

Entity Framework

↓

SQL Server

↓

Visual Studio Publish
```

---

# 28. When NOT to Use React Admin

React Admin should **not** be the default when the project requires:

- Public consumer-facing applications with rich branding
- High-performance dashboards with real-time visualization
- Complex offline-first experiences
- Pixel-perfect marketing or e-commerce experiences
- Advanced animation or interaction-heavy interfaces
- High-volume applications requiring extensive frontend optimization

In these cases, the TechLead (Architect) should evaluate React, Angular, or another appropriate frontend framework based on business and technical requirements.

---

# 29. Solution Scaffolding Workflow

When creating a new project, the Software Team Orchestrator should coordinate the following sequence:

1. Product Owner defines the product vision and initial backlog.
2. Business Analyst produces the initial requirements and user stories.
3. TechLead (Architect) selects the appropriate architecture based on this template.
4. The solution structure is scaffolded according to the approved architecture.
5. GitHub repository, project board, milestones, labels, and initial issues are created (via MCP where available).
6. Backend and frontend projects are generated.
7. Swagger is enabled and verified.
8. Playwright project is created with initial smoke tests.
9. Visual Studio Publish profiles are configured.
10. Sprint 0 deliverables are completed and submitted for human approval.

---

# 30. Success Criteria

A newly scaffolded solution is compliant when:

- The solution opens successfully in Visual Studio 2026.
- Backend APIs run locally and are accessible via Swagger.
- The frontend runs locally using the chosen framework.
- Playwright smoke tests execute successfully.
- The solution can be published using Visual Studio Publish.
- Documentation is complete.
- GitHub project artifacts are initialized.
- The architecture complies with `architecture-principles.md`.
- Coding practices comply with `coding-standards.md`.
- The project is ready to begin Sprint 1 development.
