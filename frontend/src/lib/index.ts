import { tick } from 'svelte';



export const scrollToBottom = async () => {
	await tick();
	window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};
