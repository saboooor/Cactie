const fs = require('fs');
const YAML = require('yaml');
const G = require('guilded.js');
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

const { con } = YAML.parse(fs.readFileSync('./config.yml', 'utf8'));
const guilded = new G.Client({ token: con.guilded.token });
guilded.type = { color: '\u001b[33m', name: 'guilded' };
guilded.startTimestamp = Date.now();
for (const handler of fs.readdirSync('./handlers/universal').filter(file => file.endsWith('.js'))) require(`./handlers/universal/${handler}`)(guilded);
for (const handler of fs.readdirSync('./handlers/guilded').filter(file => file.endsWith('.js'))) require(`./handlers/guilded/${handler}`)(guilded);