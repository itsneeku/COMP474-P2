<script>
	import { Button } from '$lib/components/ui/button/';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import Settings from './settings.svelte';
</script>

<div class="flex h-16 w-full justify-between">
	<Settings />
	<Button onclick={toggleMode} variant="outline" size="icon">
		<Sun class=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
		<Moon class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
	</Button>
</div>
