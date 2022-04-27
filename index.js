const fs = require('fs');

const D = require('discord.js');
const discord = new D.Client({
	shards: 'auto',
	partials: [
		D.Partials.Message,
		D.Partials.Channel,
		D.Partials.Reaction,
		D.Partials.GuildMember,
		D.Partials.User,
	],
	intents: [
		D.GatewayIntentBits.Guilds,
		D.GatewayIntentBits.GuildMessages,
		D.GatewayIntentBits.GuildMembers,
		D.GatewayIntentBits.GuildBans,
		D.GatewayIntentBits.GuildPresences,
		D.GatewayIntentBits.GuildMessageReactions,
		D.GatewayIntentBits.DirectMessages,
		D.GatewayIntentBits.GuildVoiceStates,
		D.GatewayIntentBits.MessageContent,
	],
	allowedMentions: {
		parse: ['users', 'roles', 'everyone'],
		repliedUser: false,
	},
});
discord.type = { color: '\u001b[34m', name: 'discord' };
discord.startTimestamp = Date.now();
for (const handler of fs.readdirSync('./handlers/universal').filter(file => file.endsWith('.js'))) require(`./handlers/universal/${handler}`)(discord);
for (const handler of fs.readdirSync('./handlers/discord').filter(file => file.endsWith('.js'))) require(`./handlers/discord/${handler}`)(discord);

const { guildedtoken } = require('./config/bot.json');
const G = require('guilded.js');
const guilded = new G.Client({ token: guildedtoken });
guilded.type = { color: '\u001b[33m', name: 'guilded' };
guilded.startTimestamp = Date.now();
for (const handler of fs.readdirSync('./handlers/universal').filter(file => file.endsWith('.js'))) require(`./handlers/univeral/${handler}`)(guilded);
for (const handler of fs.readdirSync('./handlers/guilded').filter(file => file.endsWith('.js'))) require(`./handlers/guilded/${handler}`)(guilded);

process.on('unhandledRejection', (reason) => {
	if (reason.rawError && (reason.rawError.message == 'Unknown Message' || reason.rawError.message == 'Unknown Interaction')) {
		discord.logger.error(JSON.stringify(reason.requestBody));
	}
});