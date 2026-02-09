# RENEN - Investment Evaluation Platform

**Structured intake + LLM analysis + Deterministic scoring = Reliable, defensible investment decisions**

RENEN is a Next.js application that automates startup idea evaluation using a combination of AI-powered analysis and deterministic scoring rules. Built for investment firms and accelerators who need reliable, auditable, investor-defensible feasibility assessments.

## 🎯 Core Features

- **Smart Idea Intake**: Text descriptions, file uploads (PDF/DOCX/PPTX), and custom questionnaires
- **LLM Analysis**: Automatic extraction of structured fields (problem, solution, market, team, traction, risks)
- **Deterministic Scoring**: Category-based evaluation with configurable weights and tier bands
- **Segment Routing**: Automatic Pass/Revise/Reject decisions with "why it matched" reasoning
- **Human Review Workflow**: Built-in guardrails - nothing auto-publishes without review
- **PDF Reports**: Professional feasibility reports generated server-side
- **Analytics**: Track every action with analytics-ready event schema

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
