
# PrepGenius

AI-powered career preparation platform that combines mock interviews, intelligent assessments, market analytics, career guidance, and AI-driven learning workflows into one modern full-stack application.

---

# 1. Project Title & Tagline

## PrepGenius
A full-stack AI career preparation suite built with Next.js, MongoDB, Groq, Gemini, and Tailwind CSS.

PrepGenius helps students and aspiring developers prepare for placements and technical interviews through:
- AI-powered mock interviews
- Career chatbot assistance
- MCQ assessments
- Industry analytics
- AI-generated feedback systems

---

# 2. Problem Statement

Technical interview preparation is usually fragmented across multiple websites and tools.

Students often switch between:
- coding platforms,
- aptitude websites,
- interview question banks,
- career guidance tools,
- and market research dashboards.

This causes:
- poor workflow continuity,
- inconsistent preparation,
- lack of centralized feedback,
- and inefficient learning.

PrepGenius solves this by providing a single integrated platform where users can:
- practice interviews,
- attempt assessments,
- analyze career trends,
- and interact with AI systems for career guidance.

---

# 3. Solution

PrepGenius combines AI workflows, caching systems, analytics dashboards, and dynamic assessment generation into a unified Next.js platform.

At a high level:
- Users access career preparation tools from a centralized dashboard.
- AI systems generate interview questions and MCQs dynamically.
- MongoDB caching reduces repeated AI requests.
- Market intelligence dashboards provide career and salary insights.
- Groq and Gemini power conversational and assessment-based AI features.
- Fallback systems ensure the application never visibly crashes during demos.

---

# 4. Key Features

## AI-Powered Mock Interview

- Dynamically generates interview questions.
- Supports role-specific interview preparation.
- Allows answer submission and AI-based evaluation.
- Generates:
  - strengths,
  - weaknesses,
  - improvement suggestions,
  - scoring summaries,
  - and detailed feedback.

---

## AI Career ChatBot

A conversational AI assistant designed for:
- DSA guidance,
- interview preparation,
- career planning,
- skill recommendations,
- resume help,
- and project guidance.

### Features
- AI-powered conversational workflow.
- MongoDB-based response caching.
- Fast repeated query handling.
- Safe fallback responses.
- Optimized demo reliability.

---

## MCQ Mock Interview Practice

Provides assessment-based interview preparation.

### Sections Included
- Aptitude
- Logical Reasoning
- Quantitative Aptitude
- Verbal Ability
- DBMS
- Operating System
- Computer Networks
- Technical Assessment

### Features
- Dynamic AI-generated MCQs.
- Retake flow with fresh questions.
- Dynamic routing using slug-based pages.
- Fallback MCQ banks for stability.

---

## Market Intelligence Hub

Provides career-market analytics and industry insights.

### Dashboard Includes
- Market outlook
- Growth pulse
- Demand level
- Salary ranges
- Median IT wage snapshot
- Trending skills
- Recommended skills
- Industry trends

---

# 5. Technology Stack

## Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Backend
- Next.js API Routes
- Node.js Runtime

## Database
- MongoDB

## AI Services
- Groq
- Google Gemini

---

# 6. MongoDB Caching Architecture

MongoDB acts as a caching and persistence layer for AI-generated responses.

### Cache Workflow

User Question
↓
Check MongoDB Cache
↓
If exists → return cached response
Else → generate using AI
↓
Save response in MongoDB
↓
Return response

### Benefits
- Reduces repeated AI calls
- Improves response speed
- Saves API usage
- Makes repeated queries instant

---

# 7. Performance Optimizations

PrepGenius includes:
- MongoDB caching layer
- Dynamic AI fallback systems
- Cache-first response architecture
- Optimized frontend rendering
- Dynamic retake question generation

---

# 8. Environment Variables

```env
GEMINI_API_KEY=
GROQ_API_KEY=
MONGODB_URI=
```

---

# 9. Installation

```bash
npm install
npm run dev
```

Open:
```txt
http://localhost:3000
```

---

# 10. Final Product Summary

PrepGenius is a modern AI-powered career preparation ecosystem built using:
- Next.js
- TypeScript
- MongoDB
- Tailwind CSS
- Groq
- Gemini

The project demonstrates:
- full-stack architecture,
- AI integration,
- caching systems,
- analytics dashboards,
- dynamic routing,
- and optimized user workflows.
