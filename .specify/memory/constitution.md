<!--
SYNC IMPACT REPORT:
Version change: 1.0.0 → 1.1.0
Modified principles: [PRINCIPLE_1_NAME] → Spec-First Development, [PRINCIPLE_2_NAME] → Claude Code-Driven Implementation, [PRINCIPLE_3_NAME] → Secure Full-Stack Architecture, [PRINCIPLE_4_NAME] → REST API and JWT Authentication, [PRINCIPLE_5_NAME] → Database Ownership and User Isolation
Added sections: None
Removed sections: None
Templates requiring updates: .specify/templates/plan-template.md ⚠ pending, .specify/templates/spec-template.md ⚠ pending, .specify/templates/tasks-template.md ⚠ pending
Follow-up TODOs: None
-->
# Hackathon Todo Application Constitution

## Core Principles

### Spec-First Development
No feature may be implemented without an approved spec in `/specs`. Specifications are the **single source of truth**. Any ambiguity must be resolved through spec updates before implementation begins. All implementation work must directly reference spec requirements.

### Claude Code-Driven Implementation
All code must be generated using Claude Code agents; no manual coding is permitted. Implementation follows agentic workflows exclusively. All changes must be traceable through Claude Code sessions and documented in Prompt History Records (PHRs).

### Secure Full-Stack Architecture
The application must follow secure-by-design principles with proper separation of concerns between frontend and backend. All data transmission must be encrypted, and security best practices must be implemented at every layer. Input validation and output encoding are mandatory.

### REST API and JWT-Based Authentication
The backend must expose a RESTful API with JWT-based authentication for all protected endpoints. Authentication tokens must be properly secured and follow industry best practices for token management, refresh mechanisms, and secure storage.

### Database Ownership and User Isolation
The application must implement proper user data isolation where each user can only access their own data. Database queries must include appropriate user context to prevent unauthorized data access. User permissions must be enforced at the application level.

### Test-Driven Development (NON-NEGOTIABLE)
All features must follow TDD practices: Tests written → Requirements validated → Tests fail → Implementation → Tests pass. Both unit and integration tests are required for all functionality. Test coverage must meet minimum thresholds before acceptance.

## Additional Constraints
The application must support a full-stack architecture with React frontend and Node.js/Express backend. Database integration must support user isolation for todo items. The application must follow modern web security practices and be deployable as a complete solution.

## Development Workflow
All development must follow Spec-Driven Development methodology using the Spec-Kit Plus framework. Each feature requires specification (spec.md), implementation plan (plan.md), and executable tasks (tasks.md). All code changes must be made through Claude Code agents with proper documentation in PHRs.

## Governance
This constitution supersedes all other development practices for the Hackathon Todo Application. Amendments require explicit documentation and approval. All pull requests and code reviews must verify compliance with these principles. The constitution must be referenced in all development decisions.

**Version**: 1.1.0 | **Ratified**: 2026-01-07 | **Last Amended**: 2026-01-07
