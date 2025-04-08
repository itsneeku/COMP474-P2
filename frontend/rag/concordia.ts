import { OllamaEmbeddings } from '@langchain/ollama';
import { RecursiveUrlLoader } from '@langchain/community/document_loaders/web/recursive_url';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { compile } from 'html-to-text';
import { get_encoding } from '@dqbd/tiktoken';
import fs from 'fs';
import { Chroma } from '@langchain/community/vectorstores/chroma';

const links = [
	{
		url: 'https://www.concordia.ca/academics/undergraduate/computer-science.html',
		depth: 4
	},
	{
		url: 'https://www.concordia.ca/academics/undergraduate/calendar/current/section-71-gina-cody-school-of-engineering-and-computer-science.html',
		depth: 2
	}
];

const scrape = async (links: { url: string; depth: number }[]) => {
	for (const [i, link] of links.entries()) {
		console.log(`${i} - Loading ${link.url}`);
		const loader = new RecursiveUrlLoader(link.url, {
			extractor: compile({ baseElements: { selectors: ['main'] } }),
			maxDepth: link.depth,
			timeout: 100000
		});
		const docs = await loader.load();
		console.log(`${i} - Documents Loaded: ${docs.length}`);
		fs.writeFileSync(`${i}.json`, JSON.stringify(docs));
	}
};

const index = async (filename: string) => {
	const enc = get_encoding('cl100k_base');
	const texts = JSON.parse(fs.readFileSync(filename, 'utf8'));
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 3000,
		chunkOverlap: 400
	});

	const splitDocs = await splitter.createDocuments(texts.map((doc) => doc.pageContent));

	const embeddings = new OllamaEmbeddings({
		model: 'nomic-embed-text',
		baseUrl: 'http://localhost:11434'
	});

	const vectorStore = new Chroma(embeddings, {
		collectionName: 'concordia-final'
	});

	for (const [i, doc] of splitDocs.entries()) {
		console.log(
			`embedding doc: ${i} of ${splitDocs.length}: Tokens: ${enc.encode(doc.pageContent).length}`
		);
		await vectorStore.addDocuments([doc]);
	}
};

// scrape(links);
// index('0.json');
// index('1.json');
