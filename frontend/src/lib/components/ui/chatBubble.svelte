<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { fade } from 'svelte/transition';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import type { Message } from '$lib/ai.svelte';
	let { message }: { message: Message } = $props();
</script>

<Card.Root
	class="rounded-4xl w-fit
	{message.role === 'user' ? 'self-end rounded-br-none' : 'self-start rounded-bl-none'}"
>
	<Card.Content>
		<p class="text-muted-foregroleflex items-center text-sm">
			{#if message.content === ''}
				<span><Ellipsis class="animate-caret-blink h-5" /></span>
			{:else}
				<span>{message.content}</span>
			{/if}
		</p>
	</Card.Content>
</Card.Root>
