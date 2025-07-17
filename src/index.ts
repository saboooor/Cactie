
import { readdirSync } from 'fs';
import { Client, Partials, GatewayIntentBits, Message, CommandInteraction, ModalSubmitInteraction, InteractionResponse, ButtonInteraction, StringSelectMenuInteraction } from 'discord.js';
import { Logger } from 'winston';
import dotenv from 'dotenv';
dotenv.config();

// Create Discord client
const client = new Client({
  shards: 'auto',
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.GuildMember,
    Partials.User,
  ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  allowedMentions: {
    parse: ['users', 'roles', 'everyone'],
  },
});

declare global {
	var sleep: typeof sleepfunc;
	var rn: Date;
	var logger: Logger;
	var error: { (err: unknown, message: Message | CommandInteraction | ModalSubmitInteraction | ButtonInteraction | StringSelectMenuInteraction, userError?: boolean): Promise<Message | InteractionResponse | undefined> };
}
function sleepfunc(ms: number) {
  return new Promise(resolve => {
    return setTimeout(resolve, ms);
  });
}
global.sleep = sleepfunc;

// Load the universal and discord-specific handlers
(async () => {
  for (const handlerName of readdirSync('./src/handlers').filter((file: string) => file.endsWith('.ts'))) {
    const handlerModule = await import(`./handlers/${handlerName}`);
    handlerModule.default(client);
  }
})();
