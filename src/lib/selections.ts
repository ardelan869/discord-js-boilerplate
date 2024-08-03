import type { Awaitable, StringSelectMenuInteraction } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

const SELECTIONS_PATH = join(
	process.cwd(),
	global.dev ? 'src' : 'dist',
	'selections',
);

type SelectionCallback = (
	interaction: StringSelectMenuInteraction,
) => Awaitable<unknown>;

interface Selection {
	id: string;
	callback: SelectionCallback;
}

function callback(id: string, callback: SelectionCallback): Selection {
	return { id, callback };
}

async function register() {
	const files = readdirSync(SELECTIONS_PATH).filter(
		(file) => file.endsWith('.ts') || file.endsWith('.js'),
	);

	for (const fileName of files) {
		const file = await import(join('file://', SELECTIONS_PATH, fileName));
		const selection = file.default;
		const isDev = fileName.includes('.dev.');

		if (!selection || !('id' in selection) || !('callback' in selection))
			continue;

		if (!isDev || global.dev)
			global.client.selections.set(selection.id, selection);
	}
}

export { callback, register, type Selection };
