<script>
	import { Button } from '$lib/components/ui/button/';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Send from '@lucide/svelte/icons/send';
	import { toggleMode } from 'mode-watcher';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
</script>

<div
	class="flex h-screen w-full flex-col items-center justify-center bg-zinc-100 p-4 dark:bg-zinc-900"
>
	<div class="h-16 self-end">
		<Button onclick={toggleMode} variant="outline" size="icon">
			<Sun class=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
		</Button>
	</div>
	<div class=" grow">
		<Card.Root>
			<Card.Header>
				<Card.Title>Create project</Card.Title>
				<Card.Description>Deploy your new project in one-click.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid w-full items-center gap-4">
					<div class="flex flex-col space-y-1.5">
						<Label for="name">Name</Label>
						<Textarea id="name" placeholder="Name of your project" />
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Deploy</Button>
			</Card.Footer>
		</Card.Root>
	</div>
	<div class="w-full max-w-5xl self-center">
		<Card.Root>
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
	</div>
</div>
