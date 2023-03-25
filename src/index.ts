import { readdirSync } from "fs";
import { Client, Partials, GatewayIntentBits } from "discord.js";
import { Logger } from "winston";

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
	var sleep: { (ms: number): Promise<undefined> };
	var logDate: string;
	var logger: Logger;
	var sql: any;
	var error: any;
}

// Load the universal and discord-specific handlers
for (const handlerName of readdirSync('./src/handlers').filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'))) {
	const handler = require(`./handlers/${handlerName}`);
	if (handler.default) handler.default(client);
	else handler(client);
}
