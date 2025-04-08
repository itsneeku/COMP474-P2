<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Settings2 from '@lucide/svelte/icons/settings-2';
	import { ai, messages, resetChatHistory } from '$lib/ai.svelte';

	let host = $state(ai.host);
	let loading = $state(false);

	let open = $state(false);
	let error = $state('');

	$effect(() => {
		if (open) {
			host = ai.host;
			error = '';
		}
	});

	const setHost = async () => {
		loading = true;
		error = '';
		try {
			if (!URL.parse(host)) throw new Error('Invalid host');
			await ai.updateHost(host);
			open = false;
		} catch (e) {
			console.error(e);
			error = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			loading = false;
		}
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<Settings2 />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Settings</Dialog.Title>
			<Dialog.Description>Want to connect to another Ollama instance?</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="host" class="text-right">Host</Label>
				<Input id="host" bind:value={host} class="col-span-3" />
			</div>
			{#if error}
				<Label class="text-center text-red-500">{error}</Label>
			{/if}
		</div>
		<Dialog.Footer>
			<Button
				type="submit"
				variant="destructive"
				disabled={loading}
				onclick={() => {
					resetChatHistory();
					open = false;
				}}
			>
				Reset Chat
			</Button>
			<Button type="submit" onclick={setHost} disabled={loading}>
				{loading ? 'Connecting...' : 'Save'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
