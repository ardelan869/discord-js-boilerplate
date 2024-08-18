# discord-js-boilerplate

A boilerplate for a Discord bot written in TypeScript. The boilerplate is inspired by and based on a YouTube tutorial (which I can't find anymore).

# Explanations

## File Routing

> [!NOTE]
> Each directory contains an example file.\
> Files including `.dev.` (a.e. `example.dev.ts`) are only included in development mode.\
> The files in the listed directories are automatically imported and registered when the bot starts up.\

- `commands/`: The commands folder.
- `events/`: The events folder.
- `selections/`: The selections folder.
- `buttons/`: The buttons folder.

## Globals

> [!NOTE]
> The globals can also be accessed without `global.`

- `global.dev` (boolean): Whether the bot is in development mode or not.
- `global.client` (Client): The Discord.js Client instance.
- `global.env` (Env): The environment variables.
- `global.config` (Config): Your config.json file, including type-safety.

# Todo

- [x] Add ESLint & Prettier
- [x] Make env variables type-safe
- [x] Add multiple-guild support
- [ ] Add runtime editing/unregistering to commands & events
- [ ] Improve buttons and selections.
  - [ ] Add temporary components
  - [ ] Add awaitable functions (maybe)
- [ ] Add a logger
- [ ] Add utilities (date formatting, etc.)
- [ ] Add stuff for User Applications
- [ ] Add an ORM, like Drizzle, or Prisma (maybe)
