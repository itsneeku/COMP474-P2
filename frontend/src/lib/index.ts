// place files you want to import through the `$lib` alias in this folder.
type Message = {
	message: string;
	sender: 'user' | 'ai';
};

export type { Message };

export const scrollToBottom = () => {
	window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};
