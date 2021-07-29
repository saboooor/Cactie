module.exports = {
	name: 'voiceticket_create',
	async execute(interaction, client) {
		const author = interaction.member.user;
		const srvconfig = client.settings.get(interaction.guild.id);
		if (!client.tickets.get(interaction.channel.id) || !client.tickets.get(interaction.channel.id).opener) return;
		if (client.tickets.get(interaction.channel.id).voiceticket) return interaction.reply({ content: 'This ticket already has a voiceticket!' });
		if (srvconfig.tickets == 'false') return interaction.reply({ content: 'Tickets are disabled!' });
		if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket is closed!' });
		const role = interaction.guild.roles.cache.get(srvconfig.supportrole);
		let parent = interaction.guild.channels.cache.get(srvconfig.ticketcategory);
		if (!parent) parent = { id: null };
		const voiceticket = await interaction.guild.channels.create(`Voiceticket${client.user.username.replace('Pup', '')} ${author.username}`, {
			type: 'GUILD_VOICE',
			parent: parent.id,
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: ['VIEW_CHANNEL'],
				},
				{
					id: client.user.id,
					allow: ['VIEW_CHANNEL'],
				},
				{
					id: author.id,
					allow: ['VIEW_CHANNEL'],
				},
				{
					id: role.id,
					allow: ['VIEW_CHANNEL'],
				},
			],
		}).catch(error => client.logger.error(error));
		interaction.reply({ content: `Voiceticket created at ${voiceticket}!` });
		client.logger.info(`Voiceticket created at #${voiceticket.name}`);
		client.tickets.set(interaction.channel.id, voiceticket.id, 'voiceticket');
	},
};