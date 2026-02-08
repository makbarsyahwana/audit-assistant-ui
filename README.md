# Audit Assistant UI

Frontend application for the AI Audit Assistant — chat interface, workflow pages, and admin dashboards.

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **TailwindCSS** — utility-first styling
- **Radix UI** — accessible headless components
- **Lucide** — icon library
- **React Markdown** — rendered AI responses with citations

## Features

### Phase 1 — Core
- **Chat Interface**: multi-turn conversation with streaming responses, citation panels, source viewer
- **Engagement Selector**: switch between audit engagements
- **Dashboard Layout**: sidebar navigation with engagement-scoped pages

### Phase 2 — Workflow Pages
- **Document Browser**: search, type/confidentiality filters, upload dialog with metadata form
- **Requirements Matrix**: requirement-control mapping with color-coded coverage cells, gap identification
- **Evidence Pack Builder**: two-column layout with pack list, evidence finder, add/remove items
- **Workpaper Editor**: expandable sections, inline editing, AI-powered draft generation
- **Finding Editor**: structured fields (criteria/condition/cause/effect/recommendation), severity tracking, AI suggestions

### Phase 3 — Admin & Observability
- **Audit Trail**: system activity review
- **User & Group Management**: role-based access administration

## Getting Started

### Prerequisites

- Node.js 18+
- Running backend API (audit-assistant-api on port 8000)

### Setup

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your API URL

# Start dev server
npm run dev
```

### Access

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Tailwind imports
│   └── (dashboard)/
│       ├── layout.tsx                # Dashboard shell (sidebar + header)
│       ├── chat/page.tsx             # Chat interface
│       └── engagements/
│           └── [id]/
│               ├── page.tsx          # Engagement detail
│               ├── documents/        # Document browser
│               ├── requirements/     # Mapping matrix
│               ├── evidence/         # Evidence pack builder
│               ├── workpapers/       # Workpaper editor
│               └── findings/         # Finding editor
├── components/
│   ├── ui/                           # Reusable UI primitives
│   ├── chat/                         # Chat-specific components
│   └── layout/                       # Sidebar, header
├── hooks/                            # Custom React hooks
├── lib/                              # Utilities, API client, mock data
└── types/                            # TypeScript type definitions
```

## Scripts

```bash
npm run dev              # Development server (port 3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint
```

## Environment Variables

See [`.env.example`](.env.example) for all available configuration options.

## License

[MIT](LICENSE)
