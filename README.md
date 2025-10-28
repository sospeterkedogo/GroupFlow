# GroupFlow
**Purpose-built collaboration platform for university computing group projects**  
Next.js · Supabase · Tailwind · GitHub integration · Real-time contribution tracking

> GroupFlow helps student teams plan tasks, track individual contributions, manage academic citations, and run project milestones — without duct-taping WhatsApp, Google Docs, and GitHub together.

---

## Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Architecture & Folders](#architecture--folders)
- [Pages & Components](#pages--components)
- [Database Schema](#database-schema)
- [API & Integrations](#api--integrations)
- [Real-time & Contribution Tracking](#real-time--contribution-tracking)
- [CI/CD & Deployment](#cicd--deployment)
- [Contributing & License](#contributing--license)
- [Contact](#contact)

---

## About
GroupFlow is a web app designed to reduce confusion and unfair workloads in student group projects by combining:

- Task management
- Contribution tracking
- Citation management
- Team communication
- Analytics dashboard

---

## Features
- **Kanban-style task boards** with milestones and deadlines  
- **Per-user contribution logs** (Supabase events + optional GitHub commits)  
- **Citation manager** for academic references  
- **Team chat & threaded comments** (real-time with Supabase Realtime)  
- **File attachments & version notes**  
- **Analytics dashboard**: workload equity, contributions timeline, completion stats
  
---

## Tech Stack
- **Frontend:** Next.js, React  
- **Styling:** Tailwind CSS  
- **Backend:** Supabase (Auth, Postgres, Realtime, Storage)  
- **Contribution tracking:** Supabase events + optional GitHub integration  
- **CI/CD:** GitHub Actions → Vercel  
- **Testing:** Jest + React Testing Library, Playwright  
- **Monitoring:** Sentry, Supabase metrics

---

## Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/sospeterkedogo/groupflow.git
