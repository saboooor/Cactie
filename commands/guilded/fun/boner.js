function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
const srvs = {};
module.exports = {
	name: 'boner',
	description: 'See your boner expand!',
	usage: '[Someone]',
	aliases: ['pp'],
	cooldown: 2,
	async execute(message, args, client) {
		try {
			// Get settings
			const srvconfig = await client.getData('settings', 'guildId', message.serverId);

			// Create initial embed and reply with it
			const ppEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Boner');

			// If current message exists, delete the old message
			if (srvs[message.channelId] && srvs[message.channelId].msg) client.messages.delete(message.channelId, srvs[message.channelId].msg.id).catch(err => client.logger.warn(err));

			// Set the data with the fields and largest number for editing the message
			srvs[message.channelId] = {
				fields: srvs[message.channelId] ? srvs[message.channelId].fields : [],
				largestNumber: srvs[message.channelId] ? srvs[message.channelId].largestNumber : 0,
				msg: await message.reply({ embeds: [ppEmbed] }),
			};

			// Push the field to the fields array
			srvs[message.channelId].fields.push({
				name: `${args[0] ? args.join(' ') : message.member.displayName}'s pp size`,
				value: '8D',
				number: Math.round(Math.random() * srvconfig.maxppsize),
			});

			// Set the field index
			const i = srvs[message.channelId].fields.length - 1;

			// Set the largest number
			if (srvs[message.channelId].fields[i].number > srvs[message.channelId].largestNumber) srvs[message.channelId].largestNumber = srvs[message.channelId].fields[i].number;

			// For pushing equals signs
			const shaft = [];

			// Add equal signs to shaft every second and edit the message
			for (let step = 0; step < srvs[message.channelId].fields[i].number; step++) {
				const sleepamt = Math.round(Math.random() * (2000 - 400 + 1) + 400);
				await sleep(sleepamt);
				srvs[message.channelId].fields[i].value = `8${shaft.join('')}D`;
				ppEmbed.setFields(srvs[message.channelId].fields);
				shaft.push('=');
				if (srvs[message.channelId].largestNumber == srvs[message.channelId].fields[i].number && srvs[message.channelId].msg) srvs[message.channelId].msg.edit({ embeds: [ppEmbed] }).catch(err => client.logger.warn(err));
			}
			await sleep(500);

			// Randomly pick between hard or soft
			const hard = Math.round(Math.random());

			// Chance of getting a SIKE u have no pp
			if (Math.round(Math.random() * 10) == 5) srvs[message.channelId].fields[i].value = `SIKE\n${args[0] ? args.join(' ') : message.member.displayName} has ${hard == 1 ? 'no pp' : 'erectile dysfunction'}`;
			else srvs[message.channelId].fields[i].value = `8${shaft.join('')}D\n${hard == 1 ? 'soft' : 'hard'} pp size = ${srvs[message.channelId].fields[i].number}"`;

			// Set the field and edit
			ppEmbed.setFields(srvs[message.channelId].fields);
			if (srvs[message.channelId].msg) srvs[message.channelId].msg.edit({ embeds: [ppEmbed] }).catch(err => client.logger.warn(err));

			// Delete the data once all the fields are finished
			if (srvs[message.channelId].largestNumber == srvs[message.channelId].fields[i].number) delete srvs[message.channelId];
		}
		catch (err) { client.error(err, message); }
	},
};