<!-- SYNC IMPACT REPORT:
Version change: N/A (initial version) → 1.0.0
Modified principles: N/A
Added sections: All sections from user input
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - .specify/templates/commands/*.md ⚠ pending review
Runtime docs: ⚠ README.md pending review
Follow-up TODOs: None
-->

# Hackathon II – The Evolution of Todo Constitution
## Project: Hackathon II – The Evolution of Todo

---

## 1. Purpose of This Constitution

This constitution defines the **binding laws, constraints, and governance rules**
for the "Evolution of Todo" project developed as part of **Hackathon II: Mastering
Spec-Driven Development & Cloud-Native AI**.

This document governs **all design, specification, planning, and implementation
activities** performed by AI agents (Claude Code) and humans (acting as system
architects).

Any output that violates this constitution is considered **invalid** and must be
discarded and regenerated.

---

## 2. Core Philosophy

This project follows **AI-Native, Spec-Driven Development** principles.

### Fundamental Beliefs
- The role of the engineer is **System Architect**, not syntax writer
- Specifications are the **single source of truth**
- AI agents generate code, humans govern intent
- Architecture must evolve safely across phases
- Intelligence must be reusable, auditable, and cloud-ready

---

## 3. Spec-Driven Development Laws

1. **Spec-First Law**
   - No code may be generated without an approved specification
   - Every feature must have a written spec before implementation

2. **Spec Supremacy Law**
   - Specs override all generated code
   - If code and spec conflict, the spec must be updated or code regenerated

3. **Traceability Law**
   - Every implementation must reference the exact spec files used
   - Spec references must use Spec-Kit notation (e.g. `@specs/features/task-crud.md`)

---

## 4. Agentic Development Workflow (Mandatory)

All development MUST follow this exact order:

1. Write or update specification
2. Generate implementation plan
3. Break plan into tasks
4. Implement using Claude Code
5. Review against specs and constitution
6. Iterate by refining specs (never by manual code edits)

Skipping or reordering steps is forbidden.

---

## 5. Human vs AI Responsibilities

### Human (System Architect)
- Defines intent, constraints, and architecture
- Writes and refines specifications
- Reviews outputs for compliance

### AI Agent (Claude Code)
- Reads constitution and specs
- Generates plans, tasks, and code
- Self-audits against this constitution

Humans **must not** write production code manually.

---

## 6. Coding Constraints (Strict)

- Manual code writing is **strictly forbidden**
- Manual bug fixes are forbidden
- Direct code edits without spec changes are forbidden
- All changes must originate from specs and be executed by Claude Code

Violations invalidate the phase submission.

---

## 7. Phase Discipline & Evolution Rules

The project evolves across five phases:

1. Phase I – In-Memory Console App (Completed)
2. Phase II – Full-Stack Web Application (Current)
3. Phase III – AI-Powered Chatbot
4. Phase IV – Local Kubernetes Deployment
5. Phase V – Advanced Cloud Deployment

### Phase Laws
- Each phase must build on previous phases
- No breaking architectural decisions without spec updates
- Phase II must remain compatible with Phases III–V
- Early shortcuts that block future phases are forbidden

---

## 8. Phase II Architectural Constraints

Phase II introduces a **distributed, multi-user system**.

Mandatory constraints:
- Stateless backend architecture
- Externalized persistent storage
- User-isolated data access
- Cloud-ready configuration (env-based)

---

## 9. Security & Authentication Laws

1. Authentication must be **stateless**
2. JWT is the only allowed authentication bridge
3. Backend must never trust frontend state
4. Every request must be authenticated
5. User identity must be derived from JWT, not request parameters
6. Database queries must always be scoped to authenticated user
7. Shared secrets must be loaded via environment variables only

Any violation is a critical failure.

---

## 10. API Governance Rules

- All APIs must be RESTful
- All endpoints must require authentication
- Unauthorized requests must return HTTP 401
- Users may only access their own resources
- Task ownership must be enforced at every operation

---

## 11. Repository Structure Law

The project must follow a **monorepo architecture**.

Mandatory structure:
- `/specs` for all specifications
- `/frontend` for Next.js application
- `/backend` for FastAPI application
- Multiple `CLAUDE.md` files allowed for layered guidance

Specs must be organized by domain:
- features
- api
- database
- ui

---

## 12. Review & Compliance Enforcement

- Claude Code must self-audit outputs against this constitution
- Non-compliant outputs must be rejected and regenerated
- Judges may inspect specs, prompts, and iteration history
- Compliance is evaluated on **process**, not just final output

---

## 13. Success Criteria

A phase is considered successful only if:
- All features are spec-driven
- No manual code was written
- Security constraints are enforced
- Architecture supports future phases
- Outputs comply fully with this constitution

---

## 14. Final Authority

This constitution is the **highest authority** in this repository.

No spec, plan, or implementation may override it.

End of Constitution

**Version**: 1.0.0 | **Ratified**: 2026-01-12 | **Last Amended**: 2026-01-12