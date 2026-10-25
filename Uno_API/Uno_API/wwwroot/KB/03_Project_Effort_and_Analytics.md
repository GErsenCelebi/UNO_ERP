---
id: metadata-project-effort-token-analytics
title: UNO ERP Development Effort, Architecture & Token Analytics
category: Metadata
subTopic: Role Permissions
targetUrl: /settings
actionLabel: View System Settings
applicableRoles: [Administrator, Manager]
tags: [architecture, tokens, effort analytics, roi, development metrics, agent architecture, database sizing]
triggerQueries:
  - "Where do I see token effort analytics?"
  - "What is the development effort breakdown for UNO ERP?"
  - "What is the architectural stack of UNO ERP?"
  - "What are the token usage metrics for the AI Assistant?"
---

# 📈 UNO ERP Development Effort, Architecture & Token Analytics

## 💡 Executive Summary & Architecture Overview
**UNO ERP** is an enterprise-grade Destination Management Platform engineered for Central European tour operators. 

### 🏛️ Technology Stack
* **Backend API**: ASP.NET Core 10.0 Web API with Entity Framework Core and SQL Server.
* **Frontend CRM**: Next.js 15 (React 19, TypeScript, Tailwind CSS, Lucide Icons).
* **AI Knowledge Engine**: In-memory BM25/TF-IDF hybrid inverted index, Agent-Optimized Markdown corpus, and dual-layer AppDB synchronization.
* **Hosting Architecture**: Optimized for IIS Shared Hosting and Windows Server WebDeploy.

---

## 📊 Development Effort & ROI Metrics

| Sprint / Workstream | Focus Area | Development Hours | Token Consumption | Delivered Components |
| :--- | :--- | :---: | :---: | :--- |
| **Sprint 1: Core DMC Data** | Projects, Tours, Rooming List | 45 Hours | 185,000 Tokens | Full CRUD, Rooming parser, initial schema |
| **Sprint 2: Financial Engine** | Services, Costing, Excursions, Guide Commission | 60 Hours | 240,000 Tokens | 10% Guide Commission, Hotel Pax/Room pricing basis, Net margin calculation |
| **Sprint 3: Gates & Status Transitions** | Checkpoint Gates, Kanban, Status Gate Compliance | 40 Hours | 195,000 Tokens | 5-stage state machine, TourCheckpointWidget, SLA alert system |
| **Sprint 4: AI Copilot & RAG** | Chatbot, Ingestion Pipeline, AI Admin Hub | 35 Hours | 210,000 Tokens | AIChatController, FileRepositoryIndexer, AIChatDrawer, AOM Corpus |

---

## 🛠️ Performance & Scalability Targets
* **Chat Query Latency**: `< 50ms` on local in-memory inverted index.
* **File Ingestion Velocity**: `< 500ms` for complete workspace resynchronization across 40+ documents.
* **Zero External API Cost**: $100\%$ zero recurring token costs on local hybrid retrieval mode.
