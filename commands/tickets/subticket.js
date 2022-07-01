function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'subticket',
	description: 'Create a subticket',
	ephemeral: true,
	aliases: ['subnew', 'sub'],
	args: true,
	usage: '<Description>',
	options: require('../../options/ticket.js'),
	botperm: 'CreatePublicThreads',
	async execute(message, args, client, lang, reaction) {
		try {
			// If the reaction isn't on the ticket panel, don't proceed
			if (reaction && message.author.id != client.user.id) return;

			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket has more than 5 subtickets
			if (message.channel.threads.cache.size > 5) return client.error('This ticket has too many subtickets!', message, true);

			// Check if ticket is closed
			if (message.channel.parent.name.startsWith('closed')) return client.error('This ticket is closed!', message, true);

			// Create Thread for subticket
			const subticket = await message.channel.threads.create({
				name: `Subticket${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1] : ''} ${message.channel.threads.cache.size + 1}`,
				autoArchiveDuration: 1440,
				reason: args[0] ? args.join(' ') : 'Created using a reaction',
			});
			client.logger.info(`Subticket created at #${subticket.name}`);
			if (message.commandName) message.reply({ content: `Subticket created at #${subticket}!` });
			await sleep(1000);

			// Get users and ping them all with subticket embed
			const users = [];
			await ticketData.users.forEach(userid => {
				const ticketmember = message.guild.members.cache.get(userid);
				if (ticketmember) users.push(ticketmember);
			});
			const CreateEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setTitle('Subticket Created')
				.setDescription('Please explain your issue and we\'ll be with you shortly.')
				.setFooter({ text: 'To close this subticket do /close, or click the button below' });

			// Add description if specified
			if (args[0]) CreateEmbed.addFields([{ name: 'Description', value: args.join(' ') }]);

			// Ping the staff if enabled
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			let ping;
			if (srvconfig.ticketmention == 'here' || srvconfig.ticketmention == 'everyone') ping = `@${srvconfig.ticketmention}`;
			else if (srvconfig.ticketmention != 'false') ping = `<@${srvconfig.ticketmention}>`;

			// If tickets is set to buttons, add buttons, if not, add reactions
			if (srvconfig.tickets == 'buttons') {
				CreateEmbed.setFooter({ text: 'To close this subticket do /close, or click the button below' });
				const row = new ActionRowBuilder()
					.addComponents([
						new ButtonBuilder()
							.setCustomId('close_subticket')
							.setLabel('Close Subticket')
							.setEmoji({ name: '🔒' })
							.setStyle(ButtonStyle.Danger),
					]);
				await subticket.send({ content: `${users}${ping ? ping : ''}`, embeds: [CreateEmbed], components: [row] });
			}
			else if (srvconfig.tickets == 'reactions') {
				CreateEmbed.setFooter({ text: 'To close this subticket do /close, or react with 🔒' });
				const Panel = await subticket.send({ content: `${users}${ping ? ping : ''}`, embeds: [CreateEmbed] });
				await Panel.react('🔒');
			}
		}
		catch (err) { client.error(err, message); }
	},
};
