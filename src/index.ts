
import { readdirSync } from 'fs';
import { Client, Partials, GatewayIntentBits, Message, CommandInteraction, ModalSubmitInteraction, InteractionResponse, ButtonInteraction, StringSelectMenuInteraction } from 'discord.js';
import { createLogger, format, Logger, transports } from 'winston';
import dotenv from 'dotenv';
import { errorFunc } from './functions/error';

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

// Set the global vars
declare global {
	var sleep: typeof sleepfunc;
	var logger: Logger;
	var error: { (err: unknown, message: Message | CommandInteraction | ModalSubmitInteraction | ButtonInteraction | StringSelectMenuInteraction, userError?: boolean): Promise<Message | InteractionResponse | undefined> };
}

function sleepfunc(ms: number) {
  return new Promise(resolve => {
    return setTimeout(resolve, ms);
  });
}
global.sleep = sleepfunc;

export const lastStarted = new Date();
function minTwoDigits(n: number) { return (n < 10 ? '0' : '') + n; }
export const logDate = `${minTwoDigits(lastStarted.getMonth() + 1)}-${minTwoDigits(lastStarted.getDate())}-${lastStarted.getFullYear()}`;

// Create a logger
global.logger = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.colorize(),
    format.timestamp(),
    format.printf(log => `[${new Date(log.timestamp).toLocaleString('default', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })} ${log.level}]: ${log.message}${log.stack ? `\n${log.stack}` : ''}`),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: `logs/${logDate}.log` }),
  ],
  rejectionHandlers: [
    new transports.Console(),
    new transports.File({ filename: `logs/${logDate}.log` }),
  ],
});
logger.info('Logger started');

global.error = errorFunc;

// Load the universal and discord-specific handlers
const handlers = readdirSync('./src/handlers').filter((file: string) => file.endsWith('.ts'));
await Promise.all(
  handlers.map(async (handlerName) => {
    const handlerModule = await import(`./handlers/${handlerName}`);
    handlerModule.default(client);
  }),
);