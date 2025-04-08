<script lang="ts">
	import { messages } from '$lib/ai.svelte';
	import ChatBubble from '$lib/components/ui/chatBubble.svelte';
	import Header from '$lib/components/ui/header.svelte';
	import InputBox from '$lib/components/ui/inputBox.svelte';

	let scrollY = $state(0);
	let innerHeight = $state(0);
	let clientHeight = $state(0);

	let scrollProgress = $derived(
		clientHeight == innerHeight ? 1 : scrollY / (clientHeight - innerHeight)
	);
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div
	bind:clientHeight
	class="items-centerjustify-center flex min-h-screen w-full flex-col bg-zinc-100 p-4 pb-0 dark:bg-zinc-900"
>
	<Header />

	<div class="flex w-full max-w-5xl grow flex-col items-center gap-4">
		{#each messages.filter((msg) => msg.role !== 'system') as message}
			<ChatBubble {message} />
		{/each}
	</div>

	<InputBox {scrollProgress} />
</div>
