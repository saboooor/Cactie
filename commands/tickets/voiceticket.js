const { ChannelType, PermissionsBitField } = require('discord.js');
module.exports = {
	name: 'voiceticket',
	description: 'Create a voiceticket',
	ephemeral: true,
	aliases: ['voicenew', 'voice'],
	botperm: 'ManageChannels',
	async execute(message, args, client, reaction) {
		try {
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			const author = client.users.cache.get(ticketData.opener);
			if (reaction && message.author.id != client.user.id) return;
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: `This is a subticket!\nYou must use this command in ${message.channel.parent}` });
			if (ticketData.voiceticket !== 'false') return message.reply({ content: 'This ticket already has a voiceticket!' });
			if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
			if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is closed!' });
			const role = message.guild.roles.cache.get(srvconfig.supportrole);
			let parent = message.guild.channels.cache.get(srvconfig.ticketcategory);
			if (!parent) parent = { id: null };
			const voiceticket = await message.guild.channels.create(`Voiceticket${client.user.username.replace('Pup', '')} ${author.username}`, {
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
			}).catch(error => client.logger.error(error));
			message.reply({ content: `Voiceticket created at ${voiceticket}!` });
			client.logger.info(`Voiceticket created at #${voiceticket.name}`);
			await client.setData('ticketdata', 'channelId', message.channel.id, 'voiceticket', voiceticket.id);
		}
		catch (err) {
			client.error(err, message);
		}
	},
};