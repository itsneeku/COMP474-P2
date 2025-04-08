import { Ollama } from 'ollama';
import { browser } from '$app/environment';
import { OllamaEmbeddings } from '@langchain/ollama';
import { Chroma } from '@langchain/community/vectorstores/chroma';

type Model = {
	label: string;
	value: string;
};

export type Message = {
	content: string;
	role: 'user' | 'ai';
};

class AI {
	constructor() {
		this.ollama = new Ollama({ host: this.host });
		this.fetchModels(this.ollama);
	}

	active: Model | null = $state(null);
	host: string = $state('http://localhost:11434');
	ollama: Ollama;
	list: Model[] = $state([]);
	chromaHost: string = $state('http://localhost:8000');
	grounding: boolean = $state(false);

	async updateHost(host: string) {
		const newOllama = new Ollama({ host: host });
		await this.fetchModels(newOllama);
		this.ollama = newOllama;
		this.host = host;
		this.active = this.list[0];
	}

	async fetchModels(ollama: Ollama) {
		const res = await ollama.list();
		this.list = res.models
			.sort((a, b) => a.name.localeCompare(b.name))
			.map((model) => ({ label: model.name, value: model.name }));
		this.active = this.list[0];
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

export const onSubmit = async (message: string) => {
	messages.push({ content: message, role: 'user' });
	messages.push({ content: '', role: 'ai' });
	try {
		const context = ai.grounding
			? await new Chroma(
					new OllamaEmbeddings({
						model: 'nomic-embed-text',
						baseUrl: ai.host
					}),
					{
						collectionName: 'concordia-final'
					}
				).similaritySearch(message, 10)
			: null;

		const response = await ai.ollama.chat({
			model: ai.active?.value ?? '',
			messages: context
				? messages.map((msg) =>
						msg.role === 'user' && msg.content
							? {
									...msg,
									content:
										msg.content +
										'\n\nUse the following context to answer this question:\n' +
										context.map((c) => c.pageContent).join('\n')
								}
							: msg
					)
				: messages,
			stream: true
		});
		for await (const part of response)
			messages[messages.length - 1].content += part.message.content;
	} catch (e) {
		console.error(e);
		messages[messages.length - 1].content = 'Sorry, something went wrong.';
	} finally {
		localStorage.setItem('messages', JSON.stringify(messages));
	}
};
