<script lang="ts">
	import Header from './header.svelte';
	import InputBox from './inputBox.svelte';
	import ChatBubble from './chatBubble.svelte';
	import type { Message } from '$lib/index';

	let scrollY = $state(0);
	let innerHeight = $state(0);
	let clientHeight = $state(0);

	let scrollProgress = $derived(scrollY / (clientHeight - innerHeight));

	const test_messages: Message[] = [
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
	];
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div
	bind:clientHeight
	class="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-100 p-4 pb-0 dark:bg-zinc-900"
>
	<div class="h-16 self-end">
		<Header />
	</div>
	<div class="flex w-full max-w-5xl grow flex-col items-center gap-4">
		{#each Array(2).fill(test_messages).flat() as message}
			<ChatBubble {message} />
		{/each}
	</div>

	<InputBox {scrollProgress} />
</div>
