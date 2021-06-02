const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_PRESENCES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'], allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true } });
client.handlers = new Discord.Collection();
const responseFiles = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
for (const file of responseFiles) require(`./handlers/${file}`)(client);