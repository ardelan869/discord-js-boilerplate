import type { CacheType, ModalSubmitInteraction } from 'discord.js';

type ModalResolver = (
  value:
    | ModalSubmitInteraction<CacheType>
    | PromiseLike<ModalSubmitInteraction<CacheType>>
) => void;

async function awaitModal(customId: string): Promise<ModalSubmitInteraction> {
  return await new Promise<ModalSubmitInteraction>((resolve) => {
    global.client.modals.set(customId, resolve);
  });
}

export { awaitModal, type ModalResolver };
