<script lang="ts">
	import Header from './header.svelte';
	import InputBox from './inputBox.svelte';
	import ChatBubble from './chatBubble.svelte';
	import type { Message } from '$lib/index';
	import { tick } from 'svelte';
	import { scrollToBottom } from '$lib';

	import { selectedModel } from '$lib/stores/selectedModel';  // Import the store

	let selected; // This will hold the selected model value

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
    model: $selectedModel,
    messages: [
      {
        role: 'user',
        content: message,
      },
    ],
  };

  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let fullResponse = '';
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

	// Responses are sent in multiple lines, parse the content only to populate chat messages
	while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      
      const decodedText = decoder.decode(value, { stream: true });
      
      try {
        const chunk = JSON.parse(decodedText);
        if (chunk.message && chunk.message.content) {
          fullResponse += chunk.message.content;
        }
      } catch (e) {
        console.error('Error parsing chunk:', e);
      }
    }


    // Final output after all chunks are received
	messages.push({ message: fullResponse.trim(), sender: 'ai' });

  } catch (error) {
    console.error('Request failed', error);
  }
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
