---
id: 001
title: Amend Constitution
stage: constitution
date: 2026-01-07
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: hp
command: sp.constitution
labels: [constitution, governance, spec-driven]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
tests:
  - none
---

## Prompt

# Spec-Driven Constitution (sp.constitution)

**Project:** Hackathon Todo Application
**Phase:** Phase II – Full-Stack Web Application

---

## 1. Purpose
This document defines the **binding constitutional rules** for Phase II development.
It enforces strict **Spec-Driven Development**, **Agentic workflows**, and **secure full-stack architecture** using Claude Code and Spec-Kit Plus.

All work must comply with this constitution; any deviation invalidates the implementation.

---

## 2. Scope
This constitution governs:

- Specification authoring and updates
- Planning and task breakdown
- Claude Code–driven implementation (no manual coding)
- Frontend and backend architecture
- REST API and JWT-based authentication
- Database ownership and user isolation
- Process documentation for evaluation

---

## 3. Core Principles

### 3.1 Spec-First Development
- No feature may be implemented without an approved spec in `/specs`.
- Specifications are the **single source of truth**.
- Any ambiguity must be re

## Response snapshot

I've successfully updated the project constitution for the Hackathon Todo Application. The constitution file at `.specify/memory/constitution.md` has been updated with specific principles for:

1. Spec-First Development - All features must have approved specs before implementation
2. Claude Code-Driven Implementation - No manual coding, all changes through Claude Code agents
3. Secure Full-Stack Architecture - Security-by-design principles
4. REST API and JWT-Based Authentication - JWT authentication for protected endpoints
5. Database Ownership and User Isolation - Proper user data isolation
6. Test-Driven Development - TDD practices required

I also updated the dependent templates to ensure consistency:
- `.specify/templates/plan-template.md` - Updated constitution check section
- `.specify/templates/spec-template.md` - Updated functional requirements to reflect constitution
- `.specify/templates/tasks-template.md` - Updated foundational tasks to include constitution requirements

The constitution is now version 1.1.0 with appropriate governance information.

## Outcome

- ✅ Impact: Updated constitution with 6 core principles for Hackathon Todo Application
- 🧪 Tests: No tests required for documentation update
- 📁 Files: 4 files updated to maintain consistency with new constitution
- 🔁 Next prompts: Ready for spec creation following new constitution
- 🧠 Reflection: Constitution now properly reflects project requirements and development methodology

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin creating feature specs following new constitution