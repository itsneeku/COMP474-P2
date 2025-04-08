import { browser } from '$app/environment';
import { WikipediaQueryRun } from '@langchain/community/tools/wikipedia_query_run';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import { formatDocumentsAsString } from 'langchain/util/document';
import { Ollama } from 'ollama';

type Model = {
	label: string;
	value: string;
};

export type Message = {
	content: string;
	role: 'human' | 'ai' | 'system';
};

const QUESTION_PATTERNS = {
	ai: /ai|artificial intelligence|machine learning|llm|language model|neural network|deep learning/i,
	concordia:
		/concordia|university|montreal|quebec|student|course|class|professor|faculty|department|program|degree|study|education|academic|school|college/i
};

const PROMPT_TEMPLATES = {
	ai: `You are an AI expert assistant. Answer the following question about artificial intelligence, machine learning, or related topics. Be technical but clear:
		{history}
		
		Current question: {question}`,
	concordia: `You are a Concordia University expert assistant. Answer the following question about Concordia University based on the provided context. If the context doesn't contain relevant information, say you cannot find the information:
		{context}
		
		Current question: {question}`,
	general: `You are a helpful AI assistant. Answer the following question based on the conversation history:
		{history}
		
		Current question: {question}`,
	grounded: `You are a helpful AI assistant with access to both conversation history and external information. Use the following information to answer the question:
		
		Wikipedia Information:
		{wikipedia}
		
		Additional Context:
		{context}
		
		Conversation History:
		{history}
		
		Current question: {question}`
};

class AI {
	constructor() {
		this.ollama = new ChatOllama({
			model: 'mistral',
			baseUrl: this.host
		});
		this.fetchModels();
	}

	active: Model | null = $state(null);
	host: string = $state('http://localhost:11434');
	ollama: ChatOllama;
	list: Model[] = $state([]);
	chromaHost: string = $state('http://localhost:8000');
	grounding: boolean = $state(false);
	vectorStore = $state(
		new Chroma(
			new OllamaEmbeddings({
				model: 'nomic-embed-text',
				baseUrl: this.host
			}),
			{
				collectionName: 'concordia-final',
				url: this.chromaHost
			}
		)
	);

	async updateHost(host: string) {
		this.ollama = new ChatOllama({
			model: this.active?.value ?? 'mistral',
			baseUrl: host
		});
		await this.fetchModels();
		this.host = host;
		this.active = this.list[0];
	}

	async fetchModels() {
		const tempOllama = new Ollama({ host: this.host });
		const res = await tempOllama.list();
		this.list = res.models
			.filter((model) => !model.name.includes('minilm') && !model.name.includes('embed'))
			.sort((a, b) => a.name.localeCompare(b.name))
			.map((model) => ({ label: model.name, value: model.name }));
		this.active = this.list.find((model) => model.value.includes('mistral')) ?? this.list[0];
		this.ollama = new ChatOllama({
			model: this.active.value,
			baseUrl: this.host
		});
	}
}

const defaultMessages: Message[] = [{ content: 'Hello', role: 'ai' }];

export const messages: Message[] = $state(
	browser ? JSON.parse(localStorage.getItem('messages') ?? JSON.stringify(defaultMessages)) : []
);

export const ai = new AI();

export const resetChatHistory = () => {
	messages.length = 0;
	messages.push(...defaultMessages);
	localStorage.setItem('messages', JSON.stringify(messages));
};

const createChain = (message: string) => {
	const wikipediaTool = new WikipediaQueryRun({
		topKResults: 3,
		maxDocContentLength: 4000
	});

	if (QUESTION_PATTERNS.ai.test(message)) {
		const prompt = PromptTemplate.fromTemplate(PROMPT_TEMPLATES.ai);
		return RunnableSequence.from([
			{
				history: () =>
					messages
						.slice(0, -1)
						.map((m) => `${m.role}: ${m.content}`)
						.join('\n'),
				question: new RunnablePassthrough()
			},
			RunnableSequence.from([prompt, ai.ollama, new StringOutputParser()])
		]);
	}

	if (ai.grounding) {
		const prompt = PromptTemplate.fromTemplate(PROMPT_TEMPLATES.grounded);
		return RunnableSequence.from([
			{
				wikipedia: async () => {
					try {
						return await wikipediaTool.invoke(message);
					} catch (e) {
						console.error('Wikipedia query failed:', e);
						return 'No Wikipedia information available.';
					}
				},
				context: QUESTION_PATTERNS.concordia.test(message)
					? ai.vectorStore.asRetriever().pipe(formatDocumentsAsString)
					: () => 'No additional context available.',
				history: () =>
					messages
						.slice(0, -1)
						.map((m) => `${m.role}: ${m.content}`)
						.join('\n'),
				question: new RunnablePassthrough()
			},
			RunnableSequence.from([prompt, ai.ollama, new StringOutputParser()])
		]);
	}

	const prompt = PromptTemplate.fromTemplate(PROMPT_TEMPLATES.general);
	return RunnableSequence.from([
		{
			history: () =>
				messages
					.slice(0, -1)
					.map((m) => `${m.role}: ${m.content}`)
					.join('\n'),
			question: new RunnablePassthrough()
		},
		RunnableSequence.from([prompt, ai.ollama, new StringOutputParser()])
	]);
};

export const onSubmit = async (message: string) => {
	try {
		const chain = createChain(message);
		messages.push({ content: message, role: 'human' });
		messages.push({ content: '', role: 'ai' });
		const stream = await chain.stream(message);
		for await (const chunk of stream) messages[messages.length - 1].content += chunk;
	} catch (e) {
		console.error(e);
		messages[messages.length - 1].content = 'Sorry, something went wrong.';
	} finally {
		localStorage.setItem('messages', JSON.stringify(messages));
	}
};
