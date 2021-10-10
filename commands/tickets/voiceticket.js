module.exports = {
	name: 'voiceticket',
	description: 'Create a voiceticket',
	aliases: ['voicenew', 'voice'],
	guildOnly: true,
	async execute(message, args, client, reaction) {
		const author = client.users.cache.get(client.tickets.get(message.channel.id).opener);
		if (reaction && message.author.id != client.user.id) return;
		const srvconfig = client.settings.get(message.guild.id);
		if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply(`This is a subticket!\nYou must use this command in ${message.channel.parent}`);
		if (!client.tickets.get(message.channel.id) || !client.tickets.get(message.channel.id).opener) return;
		if (client.tickets.get(message.channel.id).voiceticket && client.tickets.get(message.channel.id).voiceticket !== 'false') return message.reply({ content: 'This ticket already has a voiceticket!' });
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is closed!' });
		const role = message.guild.roles.cache.get(srvconfig.supportrole);
		let parent = message.guild.channels.cache.get(srvconfig.ticketcategory);
		if (!parent) parent = { id: null };
		const voiceticket = await message.guild.channels.create(`Voiceticket${client.user.username.replace('Pup', '')} ${author.username}`, {
			type: 'GUILD_VOICE',
			parent: parent.id,
			permissionOverwrites: [
				{
					id: message.guild.id,
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
		message.reply({ content: `Voiceticket created at ${voiceticket}!`, ephemeral: true });
		client.logger.info(`Voiceticket created at #${voiceticket.name}`);
		client.tickets.set(message.channel.id, voiceticket.id, 'voiceticket');
	},
};