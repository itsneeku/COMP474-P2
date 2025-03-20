<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div
	class={cn('bg-card text-card-foreground shadow-xs rounded-lg border', className)}
	{...$$restProps}
>
	<slot />
</div>
