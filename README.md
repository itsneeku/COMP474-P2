# COMP474 Project 2
40245233 - Nicolae Rusu
40240753 - Johanna Luangxay
40248336 - Jolina Vu


## Satisfied Requirements
- Multi-agent arch:
  - `general` for general questions
  - `ai` for ai-specific questions
  - `concordia` for concordia-specific questions
  - `grounding` for concordia rag and wikipedia grounding

- Context-awareness: `ya we got it`
- Knowledge Integration: `scraped+embedded concordia's website` and `wikipedia`
- Multi-turn conversation: `ya we got it`

- Local LLM Runtime: `Ollama`
- Web Frontend: `SvelteKit`
- Prompt Engineering: `Langchain.js`
- Vector DB: `ChromaDB`

## Codebase Org

- UI Components: `./frontend/src/lib/components/ui`
- Actual backend stuff: `./frontend/src/lib/ai.svelte.ts`
- RAG/Embedding: `./rag`

## Setup

### Ollama
Required models:
- `nomic-embed-text` for rag embeds
- `gemma3` for something schizo
- `mistral` for something okay ish

### Web UI

```
cd ./frontend
pnpm i
pnpm run dev
```

### ChromaDB

```
chroma run --path ./rag/chroma-concordia
```

### (Optional) Scrapping + Embedding Concordia Data
Already part of the included chromadb instance
```
node ./rag/concordia.ts
```