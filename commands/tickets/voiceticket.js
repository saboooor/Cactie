const { ChannelType, PermissionsBitField } = require('discord.js');
module.exports = {
	name: 'voiceticket',
	description: 'Create a voiceticket',
	ephemeral: true,
	aliases: ['voicenew', 'voice'],
	botperm: 'ManageChannels',
	async execute(message, args, client, lang, reaction) {
		try {
			// If the reaction isn't on the ticket panel, don't proceed
			if (reaction && message.author.id != client.user.id) return;

			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;

			// Check if ticket already has a voiceticket
			if (ticketData.voiceticket && ticketData.voiceticket !== 'false') return client.error('This ticket already has a voiceticket!', message, true);

			// Check if channel is subticket and set the channel to the parent channel
			if (message.channel.isThread()) message.channel = message.channel.parent;

			// Check if ticket is closed
			if (message.channel.name.startsWith('closed')) return client.error('This ticket is closed!', message, true);

			// Find category and if no category then set it to null
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			const parent = message.guild.channels.cache.get(srvconfig.ticketcategory);

			// Create voice channel for voiceticket
			const author = message.guild.members.cache.get(ticketData.opener).user;
			const voiceticket = await message.guild.channels.create({
				name: `Voiceticket${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1] : ''} ${author.username}`,
				type: ChannelType.GuildVoice,
				parent: parent ? parent.id : null,
				permissionOverwrites: [
					{
						id: message.guild.id,
						deny: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						id: client.user.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						id: author.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
				],
			});

			// Find role and add their permissions to the channel
			const role = message.guild.roles.cache.get(srvconfig.supportrole);
			if (role) voiceticket.permissionOverwrites.edit(role.id, { ViewChannel: true });

			// Add voiceticket to ticket database
			await client.setData('ticketdata', 'channelId', message.channel.id, 'voiceticket', voiceticket.id);

			// Reply with voiceticket open message
			message.reply({ content: `Voiceticket created at ${voiceticket}!` });
			client.logger.info(`Voiceticket created at #${voiceticket.name}`);
		}
		catch (err) { client.error(err, message); }
	},
};