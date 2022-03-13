function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
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
			if (srvconfig.bonercmd == 'false') return client.error('This command is disabled!', message, true);

			// Get random number out of the maxppsize for the amount of inches
			const random = Math.round(Math.random() * srvconfig.maxppsize);

			// Check if arg is a user and set it
			let user = null;
			if (args[0]) {
				user = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
				if (user) args[0] = user.displayName;
			}

			// Create initial embed and reply with it
			const ppEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`${args[0] ? args.join(' ') : message.member.displayName}'s pp size`)
				.setDescription('\u200b');
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

			// Randomly pick between hard or soft
			const hard = Math.round(Math.random());

			// Chance of getting a SIKE u have no pp
			if (Math.round(Math.random() * 10) == 5) {
				ppEmbed.setDescription('SIKE').setFooter({ text: `${args[0] ? args.join(' ') : message.member.displayName} has ${hard == 1 ? 'no pp' : 'erectile dysfunction'}` });
				return pp.edit({ embeds: [ppEmbed] });
			}

			// Set pp size inches to footer and edit message to final result
			ppEmbed.setFooter({ text: `${hard == 1 ? 'soft' : 'hard'} pp size = ${random}"` });
			pp.edit({ embeds: [ppEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};