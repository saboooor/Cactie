const { ChannelType, PermissionsBitField } = require('discord.js');
module.exports = {
	name: 'voiceticket',
	description: 'Create a voiceticket',
	ephemeral: true,
	aliases: ['voicenew', 'voice'],
	botperm: 'ManageChannels',
	async execute(message, args, client, reaction) {
		try {
			// If the reaction isn't on the ticket panel, don't proceed
			if (reaction && message.author.id != client.user.id) return;

			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;

			// Check if ticket already has a voiceticket
			if (ticketData.voiceticket && ticketData.voiceticket !== 'false') return message.reply({ content: 'This ticket already has a voiceticket!' });

			// Check if channel is subticket and set the channel to the parent channel
			if (message.channel.isThread()) message.channel = message.channel.parent;

			// Check if ticket is closed
			if (message.channel.name.startsWith('closed')) return message.reply({ content: 'This ticket is closed!' });

			// Find category and if no category then set it to null
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			let parent = message.guild.channels.cache.get(srvconfig.ticketcategory);
			if (!parent) parent = { id: null };

			// Find role and if no role then reply with error
			const role = message.guild.roles.cache.get(srvconfig.supportrole);
			if (!role) return message.reply({ content: 'You need to set a role with /settings supportrole <Role Id>!' });

			// Create voice channel for voiceticket
			const author = message.guild.members.cache.get(ticketData.opener).user;
			const voiceticket = await message.guild.channels.create(`Voiceticket${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1] : ''} ${author.username}`, {
				type: ChannelType.GuildVoice,
				parent: parent.id,
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
					{
						id: role.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
				],
			});

			// Add voiceticket to ticket database
			await client.setData('ticketdata', 'channelId', message.channel.id, 'voiceticket', voiceticket.id);

			// Reply with voiceticket open message
			message.reply({ content: `Voiceticket created at ${voiceticket}!` });
			client.logger.info(`Voiceticket created at #${voiceticket.name}`);
		}
		catch (err) { client.error(err, message); }
	},
};