function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { Embed } = require('guilded.js');
module.exports = {
	name: 'boner',
	description: 'See your boner expand!',
	usage: '[Someone]',
	aliases: ['pp'],
	cooldown: 10,
	async execute(message, args, client) {
		try {
			// Get settings and check if bonercmd is enabled
			const srvconfig = await client.getData('settings', 'guildId', '!guilded');
			if (srvconfig.bonercmd == 'false') return client.error('This command is disabled!', message, true);

			// Get random number out of the maxppsize for the amount of inches
			const random = Math.round(Math.random() * srvconfig.maxppsize);

			// Create initial embed and reply with it
			const ppEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`${args[0] ? args.join(' ') : message.member.user.name}'s pp size`);
			const pp = await message.reply({ embeds: [ppEmbed] });

			// For pushing equals signs
			const shaft = [];

			// Add equal signs to shaft every second and edit the message
			for (let step = 0; step < random; step++) {
				const sleepamt = Math.round(Math.random() * (1200 - 400 + 1) + 400);
				await sleep(sleepamt);
				ppEmbed.setDescription('8' + shaft.join('') + 'D');
				pp.update({ embeds: [ppEmbed] });
				shaft.push('=');
			}
			await sleep(500);

			// Randomly pick between hard or soft
			const hard = Math.round(Math.random());

			// Chance of getting a SIKE u have no pp
			if (Math.round(Math.random() * 10) == 5) {
				ppEmbed.setDescription('SIKE').setFooter(`${args[0] ? args.join(' ') : message.member.user.name} has ${hard == 1 ? 'no pp' : 'erectile dysfunction'}`);
				return pp.update({ embeds: [ppEmbed] });
			}

			// Set pp size inches to footer and edit message to final result
			ppEmbed.setFooter(`${hard == 1 ? 'soft' : 'hard'} pp size = ${random}"`);
			pp.update({ embeds: [ppEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};