<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Message } from '$lib/index';
	let { message }: { message: Message } = $props();
</script>

<Card.Root
	class="w-fit {message.sender === 'user'
		? 'rounded-4xl self-end rounded-br-none'
		: 'rounded-4xl self-start rounded-bl-none'}"
>
	<Card.Content>
		<p class="text-muted-foreground text-sm">{message.message}</p>
	</Card.Content>
</Card.Root>
