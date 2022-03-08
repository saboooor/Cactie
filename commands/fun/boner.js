function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { Embed } = require('discord.js');
module.exports = {
	name: 'boner',
	description: 'See your boner expand!',
	voteOnly: true,
	usage: '[Someone]',
	aliases: ['pp'],
	cooldown: 10,
	options: require('../options/someone.json'),
	async execute(message, args, client) {
		try {
			// Get settings and check if bonercmd is enabled
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.bonercmd == 'false') return message.reply({ content: 'This command is disabled!' });

			// Get random number out of the maxppsize for the amount of inches
			const random = Math.round(Math.random() * srvconfig.maxppsize);

			// Get name of author, or user if specified
			const name = message.member.displayName;
			let nick = args[0] ? args[0] : name;

			// Check if arg is set and is a mention and fetch that user for the name
			if (args[0] && nick.startsWith('<@') && nick.endsWith('>')) {
				const mention = nick.replace(/\D/g, '');
				nick = client.users.cache.get(mention).username;
			}

			// Create initial embed and reply with it
			const ppEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`${nick}'s pp size`)
				.setDescription('<a:loading:826611946258038805> Calculating...');
			const pp = await message.reply({ embeds: [ppEmbed] });

			// For pushing equals signs
			const shaft = [];

			// Add equal signs to shaft every second and edit the message
			for (let step = 0; step < random; step++) {
				await sleep(1200);
				ppEmbed.setDescription('8' + shaft.join('') + 'D');
				pp.edit({ embeds: [ppEmbed] });
				shaft.push('=');
			}

			// Chance of getting a SIKE u have no pp
			if (Math.round(Math.random() * 10) == 5) {
				ppEmbed.setDescription('SIKE').setFooter({ text: `${nick} has no pp` });
				return pp.edit({ embeds: [ppEmbed] });
			}

			// Set pp size inches to footer and edit message to final result
			ppEmbed.setFooter({ text: `pp size = ${random}"` });
			pp.edit({ embeds: [ppEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};