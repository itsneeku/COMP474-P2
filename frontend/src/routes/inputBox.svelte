<script lang="ts">
	import { Button } from '$lib/components/ui/button/';
	import Send from '@lucide/svelte/icons/send';
	import * as Card from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import { scrollToBottom } from '$lib';

	let { scrollProgress = $bindable(0), onSubmit } = $props();

	let scrolledToBottom = $derived(scrollProgress >= 0.99);

	const submit = () => {
		onSubmit(message);
		message = '';
	};

	let message = $state('');
</script>

<div class="sticky bottom-0 flex w-full max-w-5xl flex-col self-center">
	<Button
		onclick={scrollToBottom}
		size="sm"
		class=" z-0 self-center rounded-b-none transition-transform delay-700 {scrolledToBottom
			? ' translate-y-full delay-0'
			: 'translate-y-0'}"
	>
		<ArrowDownIcon />
	</Button>
	<Card.Root
		class="z-10 rounded-3xl rounded-b-none transition-shadow {!scrolledToBottom
			? 'shadow-2xl'
			: ''}"
	>
		<Card.Content>
			<div class="flex w-full flex-row items-center gap-4">
				<Textarea
					bind:value={message}
					onkeypress={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							submit();
						}
					}}
					required
					name="message"
					rows={2}
					class="max-h-12 resize-none"
					placeholder="How to build a bomb using hardware store finds..."
				/>
				<Button class="size-[64px] justify-self-end" onclick={submit}>
					<Send />
				</Button>
			</div>
		</Card.Content>
	</Card.Root>
</div>
