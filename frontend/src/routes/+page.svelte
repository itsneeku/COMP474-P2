<script lang="ts">
	import Header from './header.svelte';
	import InputBox from './inputBox.svelte';
	import ChatBubble from './chatBubble.svelte';
	import type { Message } from '$lib/index';
	import { tick } from 'svelte';
	import { scrollToBottom } from '$lib';

	let scrollY = $state(0);
	let innerHeight = $state(0);
	let clientHeight = $state(0);

	let scrollProgress = $derived(
		clientHeight == innerHeight ? 1 : scrollY / (clientHeight - innerHeight)
	);

	const messages: Message[] = $state([{ message: 'Hello', sender: 'ai' }]);

	// Uncomment the following to use openrouter api directly

	// const fetchResponse = async (message: string) => {
	// 	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Authorization':'Bearer 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',
	// 			'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
	// 			'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			model: "deepseek/deepseek-v3-base:free",
	// 			messages: [
	// 				{
	// 					role: 'user',
	// 					content: message
	// 				}
	// 			]
	// 		})
	// 	});

	// 	if (!response.ok) {
	// 		messages.push({ message: `HTTP error! status: ${response.status}`, sender: 'ai' });
	// 	} else {
	// 		const data = await response.json();
	// 		console.log(data);
	// 		messages.push({ message: data.choices[0].message.content, sender: 'ai' });
	// 	}
	// };


	//The the following to be comment or uncomment till line 88 to use local OLLAMA

	const fetchResponse = async (message: string) => {
		const payload = {
			model: 'deepseek-r1',
			messages: [
			{
				role: 'user',
				content: message,
			},
			],
		};

		// try {
			const res = await fetch('http://localhost:11434/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
			});

			if (!res.ok) {
			throw new Error(`Ollama API error: ${res.status}`);
			}

			const data = await res.json();

			console.log(data);

			// messages.push({ message: data.choices[0].message.content, sender: 'ai' });

		// } catch (error) {
		// 	messages.push({ message: `${error}`, sender: 'ai' });
		// 	console.log(`Error calling DeepSeek model: ${error}`);
		// }
	};

	const sendMessage = async (message: string) => {
		if (message.length === 0) return;
		messages.push({ message, sender: 'user' });
		await fetchResponse(message);
		await tick();
		scrollToBottom();
	};
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div
	bind:clientHeight
	class="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-100 p-4 pb-0 dark:bg-zinc-900"
>
	<Header />

	<div class="flex w-full max-w-5xl grow flex-col items-center gap-4">
		{#each messages as message}
			<ChatBubble {message} />
		{/each}
	</div>

	<InputBox {scrollProgress} onSubmit={sendMessage} />
</div>
