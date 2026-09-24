# Business Analyst Workflow

## Purpose

The Business Analyst (BA) serves as the bridge between business stakeholders, Product Management, UX, Architecture, and Engineering. The BA is responsible for discovering business needs, documenting requirements, validating solutions, maintaining traceability, and ensuring that GitHub remains synchronized using the available GitHub MCP integration.

---

# 1. Discovery & Elicitation

## Objective

Understand the business problem and establish a shared understanding of the initiative.

---

## Stakeholder Analysis

Identify:

- Business Sponsors
- Product Owner
- End Users
- Subject Matter Experts (SMEs)
- Engineering Teams
- Architecture
- QA
- Operations
- Compliance
- External Vendors

For each stakeholder document:

- Role
- Influence
- Decision Authority
- Communication Preferences
- Responsibilities
- Approval Authority

---

## Business Context

Define:

- Business Problem
- Strategic Objectives
- Success Criteria
- Business Drivers
- Constraints
- Assumptions
- Risks
- Scope
- Out-of-Scope Items

---

## Current State (As-Is)

Document the existing environment using:

- Process Flow Diagrams
- BPMN
- UML Activity Diagrams
- Swimlane Diagrams
- System Context Diagrams
- Value Stream Maps

Capture:

- Pain Points
- Manual Activities
- Bottlenecks
- Existing Integrations
- Existing Business Rules

---

## Outputs

- Stakeholder Matrix
- Business Context Document
- Current State Documentation
- Discovery Notes
- Initial Risk Register

---

# 2. Analysis & Modeling

## Objective

Transform business needs into solution requirements.

---

## Root Cause Analysis

Perform one or more techniques:

- Five Whys
- Fishbone Diagram
- Pareto Analysis
- SWOT
- Gap Analysis

Document:

- Root Causes
- Business Impact
- Risks
- Opportunities

---

## Future State (To-Be)

Design the desired business process using:

- BPMN
- UML
- Workflow Diagrams
- Decision Trees
- Business Process Maps

Document:

- New Process
- Automation Opportunities
- Decision Points
- Exception Paths
- Business Rules

---

## Feature Analysis

Break initiatives into:

- Capabilities
- Features
- Epics
- User Stories

Techniques may include:

- Story Mapping
- Mind Mapping
- Event Storming
- Feature Matrices

---

## Outputs

- To-Be Process
- Feature Catalogue
- Capability Map
- Business Rules

---

# 3. Requirements Documentation

## Objective

Produce implementation-ready documentation.

---

## Business Requirements Document (BRD)

Document:

- Objectives
- Business Needs
- Scope
- Stakeholders
- Success Metrics
- Risks
- Constraints

---

## Functional Requirements (FRD)

Define:

- System Behavior
- Inputs
- Outputs
- Validation Rules
- Business Logic
- Integrations
- Exception Handling

---

## Non-Functional Requirements (NFR)

Capture:

- Performance
- Scalability
- Security
- Availability
- Reliability
- Accessibility
- Compliance
- Logging
- Monitoring

---

## User Stories

Every story should include:

### Title

Concise business-oriented title.

### User Story

> As a **User**
>
> I want **Capability**
>
> So that **Business Value**

---

## Acceptance Criteria

Use Behavior-Driven Development (BDD):

Given...

When...

Then...

---

## Supporting Information

Include:

- Business Rules
- Validation Rules
- UI References
- API Requirements
- Reporting Requirements
- Security Requirements
- Error Handling
- Edge Cases
- Dependencies

---

## Outputs

- BRD
- FRD
- NFR
- User Stories
- Acceptance Criteria
- Supporting Documentation

---

# 4. Requirements Validation

## Objective

Ensure all requirements are correct, complete, and testable.

Activities:

- Stakeholder Reviews
- Requirement Walkthroughs
- Technical Reviews
- Architecture Reviews
- UX Validation
- QA Review

Verify:

- Completeness
- Consistency
- Feasibility
- Testability
- Traceability

---

# 5. GitHub Requirements Synchronization (MCP)

## Objective

Maintain GitHub as the single source of truth for implementation work by synchronizing documented requirements through the available GitHub MCP integration.

The Business Analyst is responsible for ensuring that documented requirements are accurately reflected in GitHub.

---

## Synchronization Responsibilities

Whenever GitHub MCP is available, the BA should:

- Create GitHub Issues for approved requirements.
- Update existing Issues as requirements evolve.
- Keep issue descriptions synchronized with approved documentation.
- Maintain acceptance criteria.
- Add business rules.
- Add non-functional requirements.
- Link related Issues.
- Associate Issues with Epics.
- Apply appropriate labels.
- Assign milestones where applicable.
- Link design documentation.
- Link architecture documentation.
- Record dependencies.
- Update issue status as analysis progresses.
- Close obsolete or duplicate requirements.
- Keep GitHub synchronized after every approved requirement change.

GitHub should always represent the latest approved version of the requirements.

---

# 6. Requirements Traceability

## Objective

Ensure complete traceability from business need to delivered solution.

Maintain a Requirements Traceability Matrix (RTM).

Each requirement should trace to:

- Business Objective
- Epic
- Feature
- User Story
- GitHub Issue
- Design Documentation
- Architecture Decision
- Test Cases
- UAT Scenarios
- Production Release

No requirement should exist without traceability.

---

# 7. UAT Coordination

## Objective

Support business validation before production release.

Activities:

- Prepare UAT Scenarios
- Prepare Test Data
- Define Success Criteria
- Review Edge Cases
- Coordinate Business Testers
- Record Defects
- Prioritize Fixes
- Obtain Business Sign-off

Outputs:

- UAT Plan
- Test Scenarios
- Defect Log
- Business Approval

---

# 8. Post-Implementation Review

## Objective

Validate that the delivered solution achieved the intended business outcomes.

Review:

- KPIs
- Success Metrics
- User Adoption
- Business Benefits
- Customer Feedback
- Operational Metrics

Document:

- Lessons Learned
- Remaining Gaps
- Enhancement Requests
- Future Recommendations

Feed improvements back into the Product Backlog and synchronize any resulting requirements with GitHub via MCP.

---

# Continuous Responsibilities

The Business Analyst continuously:

- Engage stakeholders
- Clarify business needs
- Maintain documentation
- Improve requirement quality
- Support Product Owners
- Support Developers
- Support QA
- Maintain traceability
- Manage requirement changes
- Validate delivered functionality
- Synchronize GitHub requirements using MCP
- Keep documentation aligned with implementation

---

# Definition of Done for Business Analysis

Business analysis is considered complete when:

- Business problem is understood.
- Stakeholders have validated the requirements.
- BRD, FRD, and NFR are complete.
- User Stories are implementation-ready.
- Acceptance Criteria are complete.
- Traceability Matrix is up to date.
- UAT scenarios are prepared.
- GitHub Issues accurately reflect the approved requirements.
- GitHub has been synchronized via MCP.
- Engineering has sufficient information to begin implementation.

---

# End-to-End Workflow

```text
Business Request
        │
        ▼
Stakeholder Discovery
        │
        ▼
Business Context
        │
        ▼
As-Is Analysis
        │
        ▼
Root Cause Analysis
        │
        ▼
To-Be Process Design
        │
        ▼
Feature Analysis
        │
        ▼
Requirements Documentation
        │
        ▼
Requirements Validation
        │
        ▼
GitHub Synchronization (MCP)
        │
        ▼
Requirements Traceability
        │
        ▼
UAT Preparation
        │
        ▼
Implementation Support
        │
        ▼
Post-Implementation Review
        │
        └──────────────► Product Backlog / GitHub Synchronization
```