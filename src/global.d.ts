declare global {
	var client: import('@/index').ExtendedClient;
	var env: NodeJS.ProcessEnv;
	var dev: boolean;
}

export {};
