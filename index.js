const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
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
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildVoiceStates,
	],
	allowedMentions: {
		parse: ['users', 'roles', 'everyone'],
		repliedUser: false,
	},
});
client.startTimestamp = Date.now();
for (const handler of fs.readdirSync('./handlers').filter(file => file.endsWith('.js'))) require(`./handlers/${handler}`)(client);