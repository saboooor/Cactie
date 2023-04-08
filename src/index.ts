import { readdirSync } from "fs";
import { Client, Partials, GatewayIntentBits, Message, CommandInteraction, ModalSubmitInteraction, InteractionResponse, ButtonInteraction, StringSelectMenuInteraction } from "discord.js";
import { Logger } from "winston";
import { query, createData, delData, getData, setData } from './functions/mysql';

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
	var logDate: string;
	var logger: Logger;
	var sql: {
		query: typeof query;
		createData: typeof createData;
		delData: typeof delData;
		getData: typeof getData;
		setData: typeof setData;
	};
	var error: { (err: any, message: Message | CommandInteraction | ModalSubmitInteraction | ButtonInteraction | StringSelectMenuInteraction, userError?: boolean): Promise<Message | InteractionResponse | undefined> };
}
function sleepfunc(ms: number) { return new Promise(resolve => { return setTimeout(resolve, ms) }) }
global.sleep = sleepfunc;

// Load the universal and discord-specific handlers
for (const handlerName of readdirSync('./src/handlers').filter((file: string) => file.endsWith('.ts'))) require(`./handlers/${handlerName}`).default(client)
