<script lang="ts">
	import type { Message } from '$lib/ai.svelte';
	import * as Card from '$lib/components/ui/card';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import { marked } from 'marked';
	let { message }: { message: Message } = $props();
</script>

<Card.Root
	class="rounded-4xl w-fit
	{message.role === 'human' ? 'self-end rounded-br-none' : 'self-start rounded-bl-none'}"
>
	<Card.Content>
		<div class="flex items-center text-sm">
			{#if message.content === ''}
				<span><Ellipsis class="animate-caret-blink h-5" /></span>
			{:else}
				<span class="prose prose-sm dark:prose-invert">{@html marked(message.content)}</span>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
