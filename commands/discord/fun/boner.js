function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
const srvs = {};
module.exports = {
	name: 'boner',
	description: 'See your boner expand!',
	voteOnly: true,
	usage: '[Someone]',
	aliases: ['pp'],
	cooldown: 2,
	options: require('../../options/someone.js'),
	async execute(message, args, client) {
		try {
			// Get settings and check if bonercmd is enabled
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.bonercmd == 'false') return client.error('This command is disabled!', message, true);

			// Check if arg is a user and set it
			let user = null;
			if (args[0]) {
				user = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
				if (user) args[0] = user.displayName;
			}

			// Create initial embed and reply with it
			const ppEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Boner');

			// If current message exists, delete the old message
			if (srvs[message.channel.id] && srvs[message.channel.id].msg) srvs[message.channel.id].msg.delete().catch(err => client.logger.warn(err));

			// Set the data with the fields and largest number for editing the message
			srvs[message.channel.id] = {
				fields: srvs[message.channel.id] ? srvs[message.channel.id].fields : [],
				largestNumber: srvs[message.channel.id] ? srvs[message.channel.id].largestNumber : 0,
				msg: await message.reply({ embeds: [ppEmbed] }),
			};

			// Push the field to the fields array
			srvs[message.channel.id].fields.push({
				name: `${args[0] ? args.join(' ') : message.member.displayName}'s pp size`,
				value: '8D',
				number: Math.round(Math.random() * srvconfig.maxppsize),
			});

			// Set the field index
			const i = srvs[message.channel.id].fields.length - 1;

			// Set the largest number
			if (srvs[message.channel.id].fields[i].number > srvs[message.channel.id].largestNumber) srvs[message.channel.id].largestNumber = srvs[message.channel.id].fields[i].number;

			// For pushing equals signs
			const shaft = [];

			// Add equal signs to shaft every second and edit the message
			for (let step = 0; step < srvs[message.channel.id].fields[i].number; step++) {
				const sleepamt = Math.round(Math.random() * (2000 - 800 + 1) + 800);
				await sleep(sleepamt);
				srvs[message.channel.id].fields[i].value = `8${shaft.join('')}D`;
				ppEmbed.setFields(srvs[message.channel.id].fields);
				shaft.push('=');
				if (srvs[message.channel.id].largestNumber == srvs[message.channel.id].fields[i].number && srvs[message.channel.id].msg) srvs[message.channel.id].msg.edit({ embeds: [ppEmbed] }).catch(err => client.logger.warn(err));
			}
			await sleep(1000);

			// Randomly pick between hard or soft
			const hard = Math.round(Math.random());

			// Chance of getting a SIKE u have no pp
			if (Math.round(Math.random() * 10) == 5) srvs[message.channel.id].fields[i].value = `SIKE\n${args[0] ? args.join(' ') : message.member.displayName} has ${hard == 1 ? 'no pp' : 'erectile dysfunction'}`;
			else srvs[message.channel.id].fields[i].value = `8${shaft.join('')}D\n${hard == 1 ? 'soft' : 'hard'} pp size = ${srvs[message.channel.id].fields[i].number}"`;

			// Set the field and edit
			ppEmbed.setFields(srvs[message.channel.id].fields);
			if (srvs[message.channel.id].msg) srvs[message.channel.id].msg.edit({ embeds: [ppEmbed] }).catch(err => client.logger.warn(err));

			// Delete the data once all the fields are finished
			if (srvs[message.channel.id].largestNumber == srvs[message.channel.id].fields[i].number) delete srvs[message.channel.id];
		}
		catch (err) { client.error(err, message); }
	},
};