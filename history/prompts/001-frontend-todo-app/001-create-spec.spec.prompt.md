---
id: 001
title: Create Spec
stage: spec
date: 2026-01-07
surface: agent
model: Claude Sonnet 4.5
feature: 001-frontend-todo-app
branch: 001-frontend-todo-app
user: hp
command: sp.specify
labels: [spec, frontend, todo-app, nextjs]
links:
  spec: specs/001-frontend-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-frontend-todo-app/spec.md
  - specs/001-frontend-todo-app/checklists/requirements.md
tests:
  - none
---

## Prompt

# sp.specify – Ultimate Frontend Prompt

**Reference Constitution:** sp.constitution
**Project:** Hackathon Todo Application – Phase II (Full-Stack Web App)
**Focus:** Frontend Only – Next.js 16+, App Router, TypeScript, Tailwind CSS, Framer Motion

---

## Objective
Implement a **professional, modern, unique, and highly polished frontend** for the Todo application.
The UI should:

- Be visually **stunning and professional** with **unique color palettes**
- Include **smooth animations and transitions** using Framer Motion
- Follow **responsive design principles** for all devices
- Use **modular, reusable components** (buttons, inputs, task cards, modals, navbars, dashboards)
- Integrate with API via `/lib/api.ts` and JWT token from Better Auth
- Be fully compliant with **sp.constitution** and `/specs/ui/` specifications

**Important:**
❌ No backend, database, or authentication logic changes
✅ Only frontend implementation
✅ Follow spec-driven workflow strictly

---

## Workflow Instructions
1. Read relevant UI specs: `@specs/ui/components.md` and `@specs/ui/pages.md`.
2. Generate a plan for implementing **all pages and components**.
3. Implement each component **with high-quality styling, responsive layouts, and animations**.
4. Use Tailwind CSS for styling; **no inline CSS**.
5. Integrate **Framer Motion** for interactive UI elements (hover effects, modals, task transitions).
6. Ensure API calls are attached with JWT token using `/lib/api.ts`.
7. Test all pages for UX, responsiveness, and visual polish.

---

## Deliverables
- Fully implemented **Next.js frontend app** under `/frontend`
- All pages and components with **unique, professional look & feel**
- **Animations and transitions** implemented with Framer Motion
- Fully responsive and production-ready UI
- Modular, reusable, and spec-driven components

---

## Enforcement
❌ No backend changes
❌ No manual coding outside Claude Code
✅ Must strictly follow `@specs/ui/...` references

## Response snapshot

Created comprehensive specification for the frontend todo application with:

- Three prioritized user stories (P1-P3) covering core functionality
- Detailed acceptance scenarios for each user story
- Identified edge cases for error handling
- 12 functional requirements including UI, API integration, and security
- Two key entities (Todo and User)
- Six measurable success criteria

The specification follows the constitution requirements and is ready for planning.

## Outcome

- ✅ Impact: Created complete spec for frontend todo app implementation
- 🧪 Tests: No tests required for specification
- 📁 Files: spec.md and requirements checklist created
- 🔁 Next prompts: Ready for planning phase with /sp.plan
- 🧠 Reflection: Spec covers all required frontend functionality with proper user flows

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to planning phase