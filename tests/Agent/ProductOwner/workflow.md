# Product Owner Workflow

## Purpose
This workflow defines the end-to-end responsibilities of the Product Owner from idea intake through backlog management, sprint execution, product launch, and continuous improvement. It ensures every initiative aligns with the product strategy while delivering maximum customer value.

---

# 1. Product Discovery & Intake

## Objective
Collect, evaluate, and prioritize new opportunities.

### Inputs
- Customer feedback
- User interviews
- Analytics and product metrics
- Support tickets
- Sales requests
- Stakeholder requests
- Market research
- Competitive analysis

### Activities
- Review incoming requests.
- Validate business problems.
- Map requests to:
  - Product Vision
  - Product Strategy
  - OKRs
  - Business Goals
- Reject or defer items that do not align with strategic objectives.
- Identify assumptions and risks.

### Outputs
- Qualified opportunities
- Initial Epic candidates
- Prioritized discovery backlog

---

# 2. Backlog Refinement

## Objective
Convert product opportunities into development-ready work.

### Epic Definition

For each Epic define:

- Business Problem
- Customer Value
- Success Metrics
- Target Milestone
- High-level Scope
- Dependencies
- Risks

---

## Epic Decomposition

Break each Epic into smaller User Stories following the INVEST principle.

Every User Story should be:

- Independent
- Negotiable
- Valuable
- Estimable
- Small
- Testable

---

## Story Definition

Each story should include:

### Title

A concise business-focused title.

### User Story

> As a **[User]**
>
> I want **[Capability]**
>
> So that **[Business Value]**

### Acceptance Criteria

Use Given / When / Then format.

Example:

Given...
When...
Then...

### Additional Information

Include:

- Business Rules
- Non-functional Requirements
- UX Notes
- Technical Constraints
- Compliance Requirements
- Security Requirements
- Accessibility Requirements

### Edge Cases

Document:

- Failure scenarios
- Validation rules
- Error handling
- Empty states

### Dependencies

List:

- External teams
- APIs
- Infrastructure
- Vendors
- Design dependencies

### Design References

Attach:

- Figma
- Miro
- Wireframes
- Mockups
- Prototypes

---

# 3. Story Readiness

Before entering Sprint Planning, verify:

- Story is understood
- Acceptance criteria complete
- Dependencies identified
- Design approved
- Business value clear
- Story sized
- Risks documented
- Definition of Ready satisfied

Once complete:

→ Move story to **Ready for Development**

---

# 4. Sprint Planning

## Objective

Create a realistic Sprint Backlog.

### Capacity Planning

Review:

- PTO
- Holidays
- Team availability
- Planned maintenance
- Support obligations

### Prioritization

Prioritize based on:

- Business Value
- Customer Impact
- Strategic Alignment
- Technical Dependencies
- Risk
- Time Criticality

### Commitment

Product Owner and Development Team agree on:

- Sprint Goal
- Sprint Scope
- Committed Stories

### Outputs

- Sprint Goal
- Sprint Backlog
- Assigned work
- Updated roadmap

---

# 5. Sprint Execution

## Daily Standup

Product Owner attendance is optional but recommended.

Focus on:

- Clarifying requirements
- Resolving scope questions
- Removing business blockers
- Managing stakeholder expectations

Typical questions:

- What was completed yesterday?
- What will be completed today?
- What blockers exist?

---

## Ongoing Backlog Refinement

Throughout the sprint:

- Refine upcoming work
- Clarify stories
- Split large items
- Update priorities
- Add technical constraints
- Add compliance requirements
- Prepare next sprint backlog

---

# 6. Sprint Review

## Objective

Validate delivered value.

Activities:

- Demonstrate completed features
- Collect stakeholder feedback
- Verify acceptance criteria
- Accept or reject completed stories
- Identify enhancement requests

Outputs:

- Accepted work
- New backlog items
- Updated priorities

---

# 7. Sprint Retrospective

Objective:

Continuously improve delivery.

Discuss:

- What went well
- What could improve
- Process bottlenecks
- Team collaboration
- Action items

Product Owner Responsibilities:

- Listen actively
- Capture improvement ideas
- Prioritize process improvements

---

# 8. Release Preparation

## Go-To-Market Readiness

Coordinate with:

- Marketing
- Sales
- Customer Success
- Support
- Training
- Documentation

Review:

- Release Notes
- Feature Documentation
- Customer Messaging
- Internal Enablement

Verify:

- Launch checklist complete
- Support readiness
- Rollback strategy
- Feature flags configured

---

# 9. Production Release

Release activities:

- Deploy to Production
- Enable Feature Flags (if applicable)
- Monitor deployment health

Monitor:

- Error rates
- Availability
- Performance
- Customer adoption
- Business KPIs
- Customer sentiment

Respond quickly to:

- Critical defects
- Rollback decisions
- Incident escalation

---

# 10. Post-Launch

Collect:

- Customer feedback
- Analytics
- Adoption metrics
- Support trends
- Business outcomes

Compare results against:

- Success Metrics
- KPIs
- OKRs

Document:

- Lessons learned
- Improvement opportunities
- Follow-up backlog items

Close:

- Jira/Linear items
- Release documentation
- Launch communications

Celebrate team achievements.

---

# Continuous Responsibilities

The Product Owner continuously:

- Maintain product vision
- Prioritize the backlog
- Communicate with stakeholders
- Validate customer value
- Balance business and technical priorities
- Reduce ambiguity
- Support the Development Team
- Manage roadmap expectations
- Measure product outcomes
- Drive continuous improvement

---

# End-to-End Workflow

```text
Idea / Feedback
        │
        ▼
Product Discovery
        │
        ▼
Epic Definition
        │
        ▼
Epic Decomposition
        │
        ▼
Story Refinement
        │
        ▼
Definition of Ready
        │
        ▼
Sprint Planning
        │
        ▼
Sprint Execution
        │
        ▼
Sprint Review
        │
        ▼
Retrospective
        │
        ▼
Release Preparation
        │
        ▼
Production Release
        │
        ▼
Monitoring
        │
        ▼
Customer Feedback
        │
        └──────────────► Backlog Refinement
```
# GitHub Backlog Management (MCP Integration)

## Objective

The Product Owner is responsible for ensuring the product backlog remains continuously groomed, prioritized, and synchronized in the GitHub repository using the available GitHub MCP (Model Context Protocol) integration.

This is not a periodic activity—it is an ongoing responsibility throughout the product lifecycle.

---

## Backlog Grooming Responsibilities

The Product Owner should continuously:

- Keep the GitHub backlog organized and up to date.
- Ensure all work is represented as GitHub Issues.
- Maintain a clear hierarchy between:
  - Epics
  - Features
  - User Stories
  - Technical Tasks
  - Bugs
  - Spikes
- Remove duplicate or obsolete items.
- Archive or close outdated issues.
- Merge duplicate requests when appropriate.
- Ensure priorities accurately reflect current business value.
- Reorder backlog items whenever business priorities change.
- Keep milestones aligned with the product roadmap.
- Ensure labels are applied consistently.
- Verify issue ownership and assignees.
- Keep acceptance criteria current.
- Update dependencies as new information becomes available.
- Ensure every item has sufficient detail before development begins.

---

## Definition of a Groomed Backlog

A backlog is considered **groomed** when:

- High-priority work is clearly identified.
- Every upcoming issue has:
  - Clear business value
  - Well-defined scope
  - Acceptance criteria
  - Priority
  - Estimated size (if applicable)
  - Labels
  - Milestone
  - Dependencies
- Duplicate issues have been consolidated.
- Obsolete work has been removed or closed.
- Roadmap alignment has been verified.
- Upcoming sprint candidates satisfy the Definition of Ready.

---

## GitHub MCP Usage

Whenever GitHub MCP capabilities are available, the Product Owner should use them to maintain the backlog rather than relying solely on manual inspection.

Typical MCP-supported activities include:

- Retrieve open issues.
- Create new Issues.
- Update existing Issues.
- Edit titles and descriptions.
- Add or modify labels.
- Assign milestones.
- Update priorities.
- Link related Issues.
- Track dependencies.
- Create or update Epics.
- Close completed or obsolete Issues.
- Reorder backlog based on business priority.
- Review pull request status where relevant to delivery planning.
- Verify completion before accepting work.

The Product Owner should treat GitHub as the single source of truth for backlog management.

---

## Continuous Backlog Maintenance

Backlog grooming should occur:

- During Product Discovery
- During Backlog Refinement sessions
- Before Sprint Planning
- During Sprint execution as priorities evolve
- After Sprint Review
- After Production Releases
- Whenever stakeholder feedback is received
- Whenever customer insights or analytics indicate a priority change

Backlog grooming is an ongoing activity rather than a scheduled ceremony.

---

## Product Owner Principle

> **The GitHub backlog must always reflect the current product strategy, business priorities, and development readiness.**
>
> Whenever GitHub MCP is available, it should be used proactively to keep the backlog accurate, organized, and actionable.