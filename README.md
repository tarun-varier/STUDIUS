# STUDIUS

An AI-powered study assistant platform that uses advanced GraphRAG (Graph-based Retrieval-Augmented Generation) technology to help students learn from their study materials. Upload documents, ask questions, and get contextually-aware answers powered by knowledge graphs and AI.

## Features

- **Study Material Management**: Upload and organize PDFs and documents with automatic AI indexing
- **Question Bank Management**: Create and manage collections of practice questions
- **AI-Powered Chat**: Ask questions and get intelligent answers derived from your study materials
- **Knowledge Graph RAG**: Advanced retrieval system using entity extraction, relationship mapping, and community detection
- **Real-time Streaming**: Live chat responses with markdown and LaTeX math support
- **Modern UI**: Responsive design with dark mode support

## Technology Stack

### Frontend
- **Next.js 16** with React 19 and TypeScript
- **Tailwind CSS 4** for styling
- **Radix UI** components
- **Axios** for API communication
- **React Markdown** with KaTeX for rendering formatted responses

### Backend
- **FastAPI** (Python 3.12) for async API server
- **PostgreSQL** with SQLModel ORM and asyncpg
- **LlamaIndex** for RAG pipeline orchestration
- **Mistral AI** for embeddings and language model
- **NetworkX** for graph operations
- **Graspologic** for community detection (hierarchical Leiden algorithm)
- **Alembic** for database migrations

## Project Structure

```
STUDIUS/
├── backend/              # FastAPI backend application
│   ├── app/
│   │   ├── api/         # API routes and endpoints
│   │   ├── core/        # Configuration and database
│   │   ├── models/      # Database models
│   │   └── services/    # Business logic and GraphRAG
│   ├── alembic/         # Database migrations
│   └── requirements.txt # Python dependencies
│
├── frontend/            # Next.js frontend application
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # API client
│   │   └── types/      # TypeScript types
│   └── package.json
│
└── playground/         # Development notebooks
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Python** 3.12+
- **PostgreSQL** database
- **Mistral API Key** (for AI features)

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd STUDIUS
```

2. Create environment files:

**Backend** - Create `backend/.env`:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/studius

# Mistral AI (required)
MISTRAL_API_KEY=your_mistral_api_key_here

# Supabase (optional)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_DB_URL=your_supabase_db_url
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run database migrations:
```bash
alembic upgrade head
```

4. Start the development server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Resources
- `GET /api/v1/resources/study-materials/` - List study materials
- `POST /api/v1/resources/study-materials/` - Upload study material
- `GET /api/v1/resources/study-materials/{id}` - Get study material by ID
- `GET /api/v1/resources/question-banks/` - List question banks
- `POST /api/v1/resources/question-banks/` - Create question bank

### Query
- `POST /api/v1/query/` - Query the knowledge graph with natural language

### System
- `GET /` - Welcome message
- `GET /health` - Health check

## How It Works

### GraphRAG Pipeline

STUDIUS implements a custom GraphRAG system inspired by Microsoft's GraphRAG:

1. **Document Upload**: Users upload study materials (PDFs, documents)
2. **Knowledge Extraction**: The system extracts entities, relationships, and descriptions using Mistral AI
3. **Graph Construction**: A property graph is built from the extracted knowledge
4. **Community Detection**: Hierarchical Leiden algorithm clusters related entities into communities
5. **Summarization**: Each community is summarized to capture key concepts
6. **Query Processing**: User questions are answered by querying relevant community summaries
7. **Response Generation**: The AI synthesizes information from multiple communities into a coherent answer

### Key Components

- **RAGService** (`backend/app/services/pipeline.py`): Orchestrates the indexing pipeline
- **GraphRAGExtractor** (`backend/app/services/graph_rag/extractor.py`): Extracts knowledge graph from documents
- **GraphRAGStore** (`backend/app/services/graph_rag/store.py`): Manages graph storage and communities
- **GraphRAGQueryEngine** (`backend/app/services/graph_rag/query_engine.py`): Handles queries using community summaries

## Development

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linting
```

### Backend Commands
```bash
# Run server
uvicorn app.main:app --reload

# Database migrations
alembic revision --autogenerate -m "description"
alembic upgrade head
alembic downgrade -1

# Version management
bump2version patch  # Increment version
```

## Architecture Highlights

- **Async Architecture**: Fully async backend with FastAPI and asyncpg for high performance
- **Background Processing**: Study material indexing runs in background tasks
- **Graph Persistence**: Knowledge graphs and community summaries are persisted to disk
- **Type Safety**: Full TypeScript on frontend, Pydantic models on backend
- **Modular Design**: Clean separation between API, business logic, and data layers
- **Scalable RAG**: Community-based retrieval scales to large document collections

## Database Schema

### StudyMaterial
- `id` (UUID, primary key)
- `title` (string)
- `description` (optional)
- `file_path` (string)
- `is_indexed` (boolean)
- `indexed_at` (timestamp)
- `created_at`, `updated_at` (timestamps)

### QuestionBank
- `id` (UUID, primary key)
- `title` (string)
- `description` (optional)
- `file_path` (string)
- `is_processed` (boolean)
- `processed_at` (timestamp)
- `created_at`, `updated_at` (timestamps)

## Contributing

This is a personal project. If you'd like to contribute or have suggestions, please feel free to open an issue or submit a pull request.

## License

This project is private and not yet licensed for public use.

## Troubleshooting

### Common Issues

**Database connection errors:**
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env` is correct
- Run migrations: `alembic upgrade head`

**Mistral API errors:**
- Verify `MISTRAL_API_KEY` is set in backend `.env`
- Check API key is valid and has sufficient quota

**Frontend can't connect to backend:**
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Verify CORS settings in `backend/app/main.py`

**Indexing fails:**
- Check file upload was successful
- Review backend logs for error messages
- Ensure sufficient disk space in `backend/storage/` and `backend/uploads/`

## Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Frontend powered by [Next.js](https://nextjs.org/)
- RAG implementation using [LlamaIndex](https://www.llamaindex.ai/)
- Community detection with [Graspologic](https://github.com/microsoft/graspologic)
- Inspired by [Microsoft GraphRAG](https://github.com/microsoft/graphrag)
