<script lang="ts">
	import { Button } from '$lib/components/ui/button/';
	import { ai } from '$lib/ai.svelte';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Settings from './settings.svelte';
	let { disabled = false } = $props();
	let open = $state(false);
</script>

<Popover.Root bind:open>
	<Popover.Trigger class="w-max self-start" {disabled}>
		<Button variant="outline" class="w-56 justify-between" {disabled}>
			<span class="truncate">{ai.active?.label || 'Select a model...'}</span>
			<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-56 p-0">
		<Command.Root>
			<Command.List>
				<Command.Empty>
					<div class="text-muted-foreground pb-2 italic">No models found</div>
					<Settings />
				</Command.Empty>
				<Command.Group>
					{#each ai.list as model}
						<Command.Item
							value={model.value}
							onSelect={() => ((ai.active = model), (open = false))}
						>
							<Check
								size={16}
								class="mr-2 shrink-0 {ai.active !== model ? 'text-transparent' : ''}"
							/>
							{model.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
