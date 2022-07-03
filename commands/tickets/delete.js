const { EmbedBuilder } = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'delete',
	description: 'Delete a ticket',
	permission: 'Administrator',
	botperm: 'ManageChannels',
	async execute(message, user, client, lang, reaction) {
		try {
			// Set author to command sender
			let author = message.member.user;

			// If this command is being used as a reaction:
			// return if the message isn't a ticket panel
			// set author to args, which is the reaction user
			if (reaction) {
				if (message.author.id != client.user.id) return;
				author = user;
			}

			// Check if channel is subticket and set the channel to the parent channel
			if (message.channel.isThread()) message.channel = message.channel.parent;

			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket is open
			if (message.channel.name.startsWith('ticket')) return client.error('This ticket needs to be closed first!', message, true);

			// Check if ticket log channel is set in settings
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.ticketlogchannel != 'false') {
				// Get transcript of ticket
				await message.reply({ content: 'Creating transcript...' });
				const messages = await message.channel.messages.fetch({ limit: 100 });
				const link = await getTranscript(messages);

				// Get list of users for embed
				const users = [];
				await ticketData.users.forEach(userid => {
					const ticketmember = message.guild.members.cache.get(userid);
					if (ticketmember) users.push(ticketmember);
				});

				// Create embed
				const DelEmbed = new EmbedBuilder()
					.setColor(Math.floor(Math.random() * 16777215))
					.setTitle(`Deleted ${message.channel.name}`)
					.addFields([
						{ name: '**Transcript**', value: `${link}` },
						{ name: '**Deleted by**', value: `${author}` },
					]);
				if (users[0]) DelEmbed.addFields([{ name: '**Users in ticket**', value: `${users}` }]);

				// Send embed to ticket log channel
				await message.guild.channels.cache.get(srvconfig.ticketlogchannel).send({ embeds: [DelEmbed] });
				client.logger.info(`Created transcript of ${message.channel.name}: ${link}`);
			}

			// Actually delete ticket and ticket database
			client.delData('ticketdata', 'channelId', message.channel.id);
			client.logger.info(`Deleted ticket #${message.channel.name}`);
			await message.channel.delete();
		}
		catch (err) { client.error(err, message); }
	},
};