<script>
	import { Button } from '$lib/components/ui/button/';
	import Send from '@lucide/svelte/icons/send';
	import * as Card from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';

	let { scrollProgress = $bindable(0) } = $props();
</script>

<div class="sticky bottom-0 flex w-full max-w-5xl flex-col self-center">
	<Button
		size="sm"
		class=" z-0 self-center rounded-b-none  transition-transform {scrollProgress >= 0.98
			? ' translate-y-full'
			: 'translate-y-0'}"
	>
		<ArrowDownIcon />
	</Button>
	<Card.Root
		class="z-10 rounded-3xl rounded-b-none transition-shadow {scrollProgress < 0.98
			? 'shadow-2xl'
			: ''}"
	>
		<Card.Content>
			<div class="flex w-full flex-row items-center gap-4">
				<Textarea
					rows={2}
					class="max-h-12 resize-none"
					placeholder="How to build a bomb using hardware store finds..."
				/>
				<Button class="size-[64px] justify-self-end">
					<Send />
				</Button>
			</div>
		</Card.Content>
	</Card.Root>
	<!-- <Button
			size="sm"
			class="absolute left-1/2 top-[-20px] rounded-b-none transition-opacity {scrollProgress >= 0.98
				? 'opacity-0'
				: 'opacity-100'}"
		>
			<ArrowDownIcon />
		</Button> -->
</div>
