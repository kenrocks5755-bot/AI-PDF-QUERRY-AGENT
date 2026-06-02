# PDF RAG AI - Chat with Your Documents

A production-ready SaaS application that lets users upload PDFs and chat with an AI agent that answers strictly from document context. Built with LangChain, LangGraph, ChromaDB, FastAPI, and Next.js 15.

## Architecture

```
Frontend (Vercel)          Backend (Render)
┌──────────────┐          ┌──────────────────┐
│  Next.js 15   │ ◄──────► │  FastAPI          │
│  TypeScript   │   REST   │  LangChain        │
│  TailwindCSS  │          │  LangGraph        │
│  shadcn/ui    │          │  ChromaDB         │
│  Zustand      │          │  Jina Embeddings  │
└──────────────┘          │  DeepSeek V4      │
                           └──────────────────┘
```

## Tech Stack

### Frontend
- **Next.js 15** - App Router, TypeScript
- **TailwindCSS** - Styling
- **shadcn/ui** - UI Components
- **Framer Motion** - Animations
- **Zustand** - State Management
- **react-markdown** - Markdown rendering
- **sonner** - Toast notifications

### Backend
- **FastAPI** - Async Python web framework
- **LangChain** - LLM framework
- **LangGraph** - Graph-based orchestration
- **ChromaDB** - Vector database
- **Jina AI** - Embeddings API
- **OpenRouter** - LLM API gateway
- **DeepSeek V4** - LLM model

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app
│   │   ├── graph.py         # LangGraph workflow
│   │   ├── rag.py           # RAG pipeline
│   │   ├── vectorstore.py   # ChromaDB operations
│   │   ├── embeddings.py    # Jina AI embeddings
│   │   ├── config.py        # Configuration
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── models.py        # LangChain models
│   │   └── __init__.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Landing page
│   │   └── dashboard/
│   │       └── page.tsx     # Dashboard
│   ├── components/
│   │   ├── chat/            # Chat components
│   │   ├── upload/          # Upload components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── landing/         # Landing page components
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom hooks
│   ├── store/               # Zustand store
│   └── lib/                 # Utilities & API client
│
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm
- OpenRouter API key
- Jina AI API key

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create and activate virtual environment with uv:**
```bash
uv venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate
```

3. **Install dependencies:**
```bash
uv pip install -r requirements.txt
```

4. **Configure environment variables:**
```bash
cp .env.example .env
```
Edit `.env` and add your API keys:
```
OPENROUTER_API_KEY=sk-or-v1-your-key
JINA_API_KEY=jina_your_key
```

5. **Run the backend:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.local.example .env.local
```
Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Run the frontend:**
```bash
npm run dev
```

5. **Open the app:**
Visit `http://localhost:3000`

## Deployment

### Backend → Render

1. Push the `backend/` directory to a GitHub repository (or use monorepo with Render root directory set to `backend`).

2. On Render, create a **New Web Service**.

3. Connect your GitHub repository.

4. Configure:
   - **Name:** `pdf-rag-ai-backend`
   - **Root Directory:** `backend` (if monorepo)
   - **Environment:** `Docker`
   - **Branch:** `main`
   - **Plan:** Starter or Pro

5. Add environment variables in Render dashboard:
   - `OPENROUTER_API_KEY`
   - `JINA_API_KEY`
   - `PORT` (set automatically by Render)

6. Deploy.

### Frontend → Vercel

1. Push the `frontend/` directory to a GitHub repository (or use monorepo with root directory set to `frontend`).

2. On Vercel, import your repository.

3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend` (if monorepo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-render-backend.onrender.com`

5. Deploy.

## Production Build Commands

### Backend
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend
```bash
npm run build
npm start
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/upload` | POST | Upload PDF |
| `/chat` | POST | Ask question |
| `/documents` | GET | List documents |

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `JINA_API_KEY` | Jina AI API key |
| `CHROMA_PERSIST_DIR` | ChromaDB storage path |
| `UPLOAD_DIR` | Upload directory path |

### Frontend
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |

## LangGraph Workflow

```
Upload Flow:
PDF → Upload → Chunk → Embed → Store in ChromaDB

Chat Flow:
Question → Retrieve Context → Reason → Generate Answer → Return with Sources
```

The graph includes:
- Upload processing node
- Retrieval node (ChromaDB similarity search)
- Reasoning & generation node (DeepSeek V4 via OpenRouter)
- Conditional edges for error handling and context availability

## Key Features

- **No Hallucinations**: Answers are strictly grounded in uploaded document context
- **Source Citations**: Every answer includes references to source document chunks
- **Semantic Search**: Jina AI embeddings for accurate retrieval
- **Persistent Storage**: ChromaDB stores vectors locally
- **Premium UI**: Linear-inspired design with Framer Motion animations
- **Dark Mode**: Beautiful dark-first interface
- **Responsive**: Works on all screen sizes

## License

MIT
