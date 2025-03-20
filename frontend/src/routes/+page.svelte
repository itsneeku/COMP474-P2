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

	const messages: Message[] = $state([
		{ message: 'meow', sender: 'user' },
		{ message: 'Hello', sender: 'ai' },
		{ message: 'meow meow', sender: 'user' },
		{ message: 'meow meow meow', sender: 'ai' },
		{ message: 'meow meow meow meow meow', sender: 'user' },
		{
			message:
				'meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow',
			sender: 'ai'
		}
	]);

	const fetchResponse = async () => {
		messages.push({ message: 'meow?', sender: 'ai' });
	};

	const sendMessage = async (message: string) => {
		if (message.length === 0) return;
		messages.push({ message, sender: 'user' });
		await fetchResponse();
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
