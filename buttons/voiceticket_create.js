module.exports = {
	name: 'voiceticket_create',
	botperm: 'MANAGE_CHANNELS',
	deferReply: true,
	async execute(interaction, client) {
		// Check if ticket is an actual ticket
		const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${interaction.channel.id}'`))[0];
		if (!ticketData) return interaction.reply('Could not find this ticket in the database, please manually delete this channel.');

		// Check if ticket already has a voiceticket
		if (ticketData.voiceticket && ticketData.voiceticket !== 'false') return interaction.reply({ content: 'This ticket already has a voiceticket!' });

		// Check if ticket is closed
		if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket is closed!' });

		// Find category and if no category then set it to null
		const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
		let parent = interaction.guild.channels.cache.get(srvconfig.ticketcategory);
		if (!parent) parent = { id: null };

		// Find role and if no role then reply with error
		const role = interaction.guild.roles.cache.get(srvconfig.supportrole);
		if (!role) return interaction.reply({ content: 'You need to set a role with /settings supportrole <Role Id>!' });

		// Create voice channel for voiceticket
		const author = client.users.cache.get(ticketData.opener);
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
		await client.setData('ticketdata', 'channelId', interaction.channel.id, 'voiceticket', voiceticket.id);

		// Reply with voiceticket open message
		interaction.reply({ content: `Voiceticket created at ${voiceticket}!` });
		client.logger.info(`Voiceticket created at #${voiceticket.name}`);
	},
};