function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
module.exports = {
	name: 'subticket_create',
	botperm: 'CREATE_PUBLIC_THREADS',
	deferReply: true,
	ephemeral: true,
	async execute(interaction, client) {
		// Check if ticket is an actual ticket
		const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${interaction.channel.id}'`))[0];
		if (!ticketData) return interaction.reply({ content: 'Could not find this ticket in the database, please manually delete this channel.' });
		if (ticketData.users) ticketData.users = ticketData.users.split(',');

		// Check if ticket has more than 5 subtickets
		if (interaction.channel.threads.cache.size > 5) return interaction.reply({ content: 'This ticket has too many subtickets!' });

		// Check if ticket is closed
		if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket is closed!' });

		// Create Thread for subticket
		const subticket = await interaction.channel.threads.create({
			name: `Subticket${client.user.username.replace('Pup', '') + ' '}${interaction.channel.threads.cache.size + 1}`,
			autoArchiveDuration: 1440,
			reason: 'Created with a button',
		});
		client.logger.info(`Subticket created at #${subticket.name}`);
		interaction.reply({ content: `Subticket created at #${subticket}!` });
		await sleep(1000);

		// Get users and ping them all with subticket embed
		const users = [];
		await ticketData.users.forEach(userid => users.push(client.users.cache.get(userid)));
		const Embed = new MessageEmbed()
			.setColor(3447003)
			.setTitle('Subticket Created')
			.setDescription('Please explain your issue and we\'ll be with you shortly.')
			.addField('Description', 'Created with a button');

		// Check if ticket mode is buttons or reactions and do stuff
		const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
		if (srvconfig.tickets == 'buttons') {
			Embed.setFooter({ text: 'To close this subticket do /close, or click the button below' });
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('close_subticket')
						.setLabel('Close Subticket')
						.setEmoji('🔒')
						.setStyle('DANGER'),
				);
			await subticket.send({ content: `${users}`, embeds: [Embed], components: [row] });
		}
		else if (srvconfig.tickets == 'reactions') {
			Embed.setFooter({ text: 'To close this subticket do /close, or react with 🔒' });
			const embed = await subticket.send({ content: `${users}`, embeds: [Embed] });
			await embed.react('🔒');
		}
	},
};
