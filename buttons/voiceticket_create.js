module.exports = {
	name: 'voiceticket_create',
	botperms: 'MANAGE_CHANNELS',
	async execute(interaction, client) {
		interaction.deferUpdate();
		// Check if ticket is an actual ticket
		if (!client.tickets.get(interaction.channel.id)) return;

		// Check if ticket already has a voiceticket
		if (client.tickets.get(interaction.channel.id).voiceticket && client.tickets.get(interaction.channel.id).voiceticket !== 'false') return interaction.reply({ content: 'This ticket already has a voiceticket!' });

		// Check if ticket is closed
		if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket is closed!' });

		// Find category and if no category then set it to null
		const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
		let parent = interaction.guild.channels.cache.get(srvconfig.ticketcategory);
		if (!parent) parent = { id: null };

		// Find role and if no role then reply with error
		const role = interaction.guild.roles.cache.get(srvconfig.supportrole);
		if (!role) return interaction.reply({ content: `You need to set a role with ${srvconfig.prefix}settings supportrole <Role Id>!` });

		// Create voice channel for voiceticket
		const author = client.users.cache.get(client.tickets.get(interaction.channel.id).opener);
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

		// Add voiceticket to ticket database
		client.tickets.set(interaction.channel.id, voiceticket.id, 'voiceticket');

		// Reply with voiceticket open message
		interaction.reply({ content: `Voiceticket created at ${voiceticket}!` });
		client.logger.info(`Voiceticket created at #${voiceticket.name}`);
	},
};