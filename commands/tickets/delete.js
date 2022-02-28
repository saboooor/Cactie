const { MessageEmbed } = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'delete',
	description: 'Delete a ticket',
	permission: 'ADMINISTRATOR',
	botperm: 'MANAGE_CHANNELS',
	async execute(message, user, client, reaction) {
		try {
			let author = message.member.user;
			if (reaction) {
				if (message.author.id != client.user.id) return;
				author = user;
			}
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: `This is a subticket!\nYou must use this command in ${message.channel.parent}` });

			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');
			if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
			if (message.channel.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket needs to be closed first!' });
			if (srvconfig.logchannel != 'false') {
				await message.reply({ content: 'Creating transcript...' });
				const messages = await message.channel.messages.fetch({ limit: 100 });
				const link = await getTranscript(messages);
				const users = [];
				await ticketData.users.forEach(userid => users.push(client.users.cache.get(userid)));
				const Embed = new MessageEmbed()
					.setColor(Math.floor(Math.random() * 16777215))
					.setTitle(`Deleted ${message.channel.name}`)
					.addField('**Users in ticket**', `${users}`)
					.addField('**Transcript**', `${link}.txt`)
					.addField('**Deleted by**', `${author}`);
				await message.guild.channels.cache.get(srvconfig.logchannel).send({ embeds: [Embed] });
				client.logger.info(`Created transcript of ${message.channel.name}: ${link}.txt`);
			}
			client.delData('ticketdata', 'channelId', message.channel.id);
			client.logger.info(`Deleted ticket #${message.channel.name}`);
			await message.channel.delete();
		}
		catch (err) {
			client.error(err, message);
		}
	},
};