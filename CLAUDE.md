# CLAUDE.md - AI Assistant Context & Engineering Conventions

## 1. Project Overview
- **Name**: FlyRank AI Lead Qualification Widget (ai-lead-qualifier)
- **Track**: Frontend AI Engineering Capstone (FE1 Direction)
- **Purpose**: Real-time conversational AI widget that qualifies inbound website visitors using the BANT framework (Budget, Authority, Need, Timeline) and outputs structured CRM JSON payloads.

## 2. Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **Icons**: lucide-react

## 3. Architecture & Code Conventions
- **Component Structure**: Functional components with strict TypeScript props interfaces.
- **Accessibility (a11y)**: Chat log uses role="log" and aria-live="polite"; all interactive buttons use explicit aria-label attributes.
- **Git Workflow**: Conventional Commits v1.0.0 (feat:, fix:, docs:, chore:).
