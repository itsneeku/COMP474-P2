<script lang="ts">
	import { scrollToBottom } from '$lib';
	import { ai, onSubmit } from '$lib/ai.svelte';
	import ModelSelector from '$lib/components/ui/ModelSelector.svelte';
	import { Button } from '$lib/components/ui/button/';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import Send from '@lucide/svelte/icons/send';
	let { scrollProgress = $bindable(0) } = $props();
	let message = $state('');
	let scrolledToBottom = $derived(scrollProgress >= 0.99);
	let responding = $state(false);
	const submit = async () => {
		if (message.trim().length === 0 || !ai.active) return false;

		try {
			responding = true;
			await onSubmit(message);
			message = '';
		} catch (e) {
			console.error(e);
		} finally {
			responding = false;
		}
	};
</script>

<div class="sticky bottom-0 flex w-full max-w-5xl flex-col self-center">
	<Button
		onclick={scrollToBottom}
		size="sm"
		class="z-0 self-center rounded-b-none transition-transform delay-700
		{scrolledToBottom ? 'translate-y-full delay-0' : 'translate-y-0'}"
	>
		<ArrowDownIcon />
	</Button>

	<Card.Root
		class="z-10 rounded-3xl rounded-b-none transition-all duration-300 ease-in-out
		{!scrolledToBottom ? 'shadow-2xl' : ''}"
	>
		<Card.Content class="transition-all duration-300 ease-in-out">
			<div class="flex w-full flex-col gap-2">
				<div class="flex w-full gap-4">
					<Textarea
						disabled={responding}
						bind:value={message}
						onkeypress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), submit())}
						required
						name="message"
						rows={2}
						class="max-h-12 resize-none transition-all duration-300 ease-in-out"
						placeholder="How to build a bomb using hardware store finds..."
					/>
					<Button class="size-12" onclick={submit} disabled={responding}>
						<Send />
					</Button>
				</div>
				<div class="flex justify-between">
					<ModelSelector disabled={responding} />

					<div class="flex-col items-end justify-end gap-2">
						<div class="flex items-center justify-end gap-2">
							<Label
								for="grounding"
								class="text-sm font-medium {!ai.grounding ? 'text-gray-500' : ''}">Grounding</Label
							>

							<Switch id="grounding" bind:checked={ai.grounding} />
						</div>
						<Label class="text-xs text-gray-500">
							Use context from Concordia's website and Wikipedia.</Label
						>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
