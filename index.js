const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_PRESENCES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS'], allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true } });
require('./handlers/login.js')(client);
require('./handlers/commands.js')(client);
require('./handlers/responses.js')(client);
require('./handlers/event.js')(client);
require('./handlers/database.js')(client);
require('./handlers/autodelete.js')(client);