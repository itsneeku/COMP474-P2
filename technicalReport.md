# Technical Report

## Architecture
The project is a SvelteKit-based web app relying on an Ollama and ChromaDB instance.
The user interacts directly with the web app, and their requests are preprocessed and routed using Langchain.js as a one-end middleman.

Depending on the user's question pattern and if they have chosen to use `grounding`, different chains are triggered.

Ex 1:
```
Q: How does reinforcement learning work? [Grounding=OFF]

Q -> AI System Prompt -> History Chain -> Answer
```
Ex 2:
```
Q: How does reinforcement learning work? [Grounding=ON]

Q -> AI System Prompt -> History Chain -> Wikipedia Chain -> Answer
```
Ex 3:
```
Q: What does Concordia offer as part of their CompSci Curriculum? [Grounding=ON]

Q -> Concordia System Prompt -> History Chain -> Concordia Embeddings Chain -> Answer
```

## Design Decisions

We've chosen to use `Langchain.js` instead of the proposed `Langchain.py` due to:
1. Its broader availability of web scraping integrations supporting javascript-heavy websites
2. Our team's previous experience with web development being centered around Node.js-based frameworks.

As such, we also used `SvelteKit` as our web framework instead of the proposed `FastAPI` to keep our tech stack as slim as possible.
This has allowed us to be more efficient and deliver higher quality work (both functionality-wise and visual design-wise).

## Challenges

Our main challenge consisted of generating vector embeds on the large amount of pages we've scraped from Concordia's website (411 pages).
We used `nomic-embed-text` to embed them, but had to continuously lower our splitting chunk size to stay within the model's 8192 token context window.
We suspect that is due to how the model processes non-alphanumeric characters, which the concordia website uses a lot of as part of its internal pages linkage ("[", "]", "/")