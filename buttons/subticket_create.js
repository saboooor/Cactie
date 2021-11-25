function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
module.exports = {
	name: 'subticket_create',
	botperms: 'CREATE_PUBLIC_THREADS',
	async execute(interaction, client) {
		// Check if ticket is an actual ticket
		if (!client.tickets.get(interaction.channel.id)) return;

		// Check if ticket has more than 5 subtickets
		if (interaction.channel.threads.cache.size > 5) return interaction.reply({ content: 'This ticket has too many subtickets!', ephemeral: true });

		// Check if ticket is closed
		if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket is closed!', ephemeral: true });

		// Create Thread for subticket
		const subticket = await interaction.channel.threads.create({
			name: `Subticket${client.user.username.replace('Pup', '') + ' '}${interaction.channel.threads.cache.size + 1}`,
			autoArchiveDuration: 1440,
			reason: 'Created with a button',
		});
		client.logger.info(`Subticket created at #${subticket.name}`);
		interaction.reply({ content: `Subticket created at #${subticket}!`, ephemeral: true });
		await sleep(1000);

		// Get users and ping them all with subticket embed
		const users = [];
		await client.tickets.get(interaction.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
		const Embed = new MessageEmbed()
			.setColor(3447003)
			.setTitle('Subticket Created')
			.setDescription('Please explain your issue and we\'ll be with you shortly.')
			.addField('Description', 'Created with a button');

		// Check if ticket mode is buttons or reactions and do stuff
		const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
		if (srvconfig.tickets == 'buttons') {
			Embed.setFooter(`To close this subticket do ${srvconfig.prefix}close, or click the button below`);
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
			Embed.setFooter(`To close this subticket do ${srvconfig.prefix}close, or react with 🔒`);
			const embed = await subticket.send({ content: `${users}`, embeds: [Embed] });
			await embed.react('🔒');
		}
	},
};
