interface Window {
	FB?: {
		ui: (params: Record<string, unknown>, cb: () => void) => void;
	};
	zE?: {
		hide(): void;
		activate(): void;
		setLocale(locale: string): void;
		identify(options: Partial<{name: string; email: string}>): void;
	};
}
