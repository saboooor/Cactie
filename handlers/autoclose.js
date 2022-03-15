const { schedule } = require('node-cron');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const getTranscript = require('../functions/getTranscript.js');
module.exports = client => {
	schedule('0 0 * * *', async () => {
		// Get all users who have voted recently
		const voteData = await client.query('SELECT * FROM lastvoted');
		voteData.forEach(async data => {
			if (data.timestamp + 86400000 < Date.now()) {
				// If the user has not voted in 24 hours, remove them from the vote database
				await client.delData('lastvoted', 'userId', data.userId);
			}
		});
		// Get all tickets
		const ticketData = await client.query('SELECT * FROM ticketdata');
		ticketData.forEach(async data => {
			if (data.resolved == 'true') {
				data.users = data.users.split(',');
				const channel = await client.channels.cache.get(data.channelId);
				channel.setName(channel.name.replace('ticket', 'closed'));
				await sleep(1000);
				if (channel.name.includes(`ticket${client.user.username.replace('Cactie', '').replace(' ', '').toLowerCase()}-`)) return channel.send({ content: 'Failed to close ticket, please try again in 10 minutes' });
				if (data.voiceticket !== 'false') {
					const voiceticket = await channel.guild.channels.cache.get(data.voiceticket);
					voiceticket.delete().catch(err => client.logger.error(err));
					await client.setData('ticketdata', 'channelId', channel.id, 'voiceticket', 'false');
				}
				await client.setData('ticketdata', 'channelId', channel.id, 'resolved', 'false');
				await data.users.forEach(userid => channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: false }));
				const messages = await channel.messages.fetch({ limit: 100 });
				const link = await getTranscript(messages);
				const users = [];
				await data.users.forEach(userid => users.push(client.users.cache.get(userid)));
				const EmbedDM = new MessageEmbed()
					.setColor(Math.floor(Math.random() * 16777215))
					.setTitle(`Closed ${channel.name}`)
					.addField('**Users in ticket**', `${users}`)
					.addField('**Transcript**', `${link}.txt`)
					.addField('**Closed by**', 'Automatically closed');
				client.logger.info(`Created transcript of ${channel.name}: ${link}.txt`);
				users.forEach(usr => {
					usr.send({ embeds: [EmbedDM] })
						.catch(error => { client.logger.warn(error); });
				});
				const Embed = new MessageEmbed()
					.setColor(15105570)
					.setDescription('Automatically closed Resolved Ticket');
				const srvconfig = await client.getData('settings', 'guildId', channel.guild.id);
				if (srvconfig.tickets == 'buttons') {
					const row = new MessageActionRow()
						.addComponents([
							new MessageButton()
								.setCustomId('delete_ticket')
								.setLabel('Delete Ticket')
								.setEmoji('⛔')
								.setStyle('DANGER'),
							new MessageButton()
								.setCustomId('reopen_ticket')
								.setLabel('Reopen Ticket')
								.setEmoji('🔓')
								.setStyle('PRIMARY'),
						]);
					channel.send({ embeds: [Embed], components: [row] });
				}
				else if (srvconfig.tickets == 'reactions') {
					Embed.setColor(3447003);
					Embed.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
					const embed = await channel.send({ embeds: [Embed] });
					embed.react('🔓');
					embed.react('⛔');
				}
				client.logger.info(`Closed resolved ticket #${channel.name}`);
			}
		});
	});
	client.logger.info('Ticket autoclose loaded');
};