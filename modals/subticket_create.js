function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'subticket_create',
	deferReply: true,
	ephemeral: true,
	async execute(interaction, client) {
		try {
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${interaction.channel.id}'`))[0];
			if (!ticketData) return client.error('Could not find this ticket in the database, please manually delete this channel.', interaction, true);
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket has more than 5 subtickets
			if (interaction.channel.threads.cache.size > 5) return client.error('This ticket has too many subtickets!', interaction, true);

			// Check if ticket is closed
			if (interaction.channel.parent.name.startsWith('closed')) return client.error('This ticket is closed!', interaction, true);

			// Create Thread for subticket
			const subticket = await interaction.channel.threads.create({
				name: `Subticket${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1] : ''} ${interaction.channel.threads.cache.size + 1}`,
				autoArchiveDuration: 1440,
				reason: interaction.fields.getTextInputValue('description'),
			});
			client.logger.info(`Subticket created at #${subticket.name}`);
			interaction.reply({ content: `Subticket created at #${subticket}!` });
			await sleep(1000);

			// Get users and ping them all with subticket embed
			const users = [];
			await ticketData.users.forEach(userid => {
				const member = interaction.guild.members.cache.get(userid);
				if (member) users.push(member.user);
			});
			const CreateEmbed = new EmbedBuilder()
				.setColor(0x5662f6)
				.setTitle('Subticket Created')
				.setDescription('Please explain your issue and we\'ll be with you shortly.')
				.addFields([{ name: 'Description', value: interaction.fields.getTextInputValue('description') }])
				.setFooter({ text: 'To close this subticket do /close, or click the button below' });

			// Ping the staff if enabled
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			let ping = null;
			if (srvconfig.ticketmention == 'here' || srvconfig.ticketmention == 'everyone') ping = `@${srvconfig.ticketmention}`;
			else if (srvconfig.ticketmention != 'false') ping = `<@${srvconfig.ticketmention}>`;

			// Create close button and send panel to subticket
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
		catch (err) { client.error(err, interaction); }
	},
};