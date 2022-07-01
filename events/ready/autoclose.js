const { schedule } = require('node-cron');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const getTranscript = require('../../functions/getTranscript.js').discord;
module.exports = client => {
	schedule('0 0 * * *', async () => {
		// Get all tickets
		const ticketData = await client.query('SELECT * FROM ticketdata');
		ticketData.forEach(async data => {
			if (data.resolved == 'true') {
				data.users = data.users.split(',');
				const guild = await client.guilds.cache.get(data.guildId);
				const channel = await guild.channels.cache.get(data.channelId);
				channel.setName(channel.name.replace('ticket', 'closed'));
				await sleep(1000);
				if (channel.name.includes(`ticket${client.user.username.split(' ')[1] ? client.user.username.split(' ')[1].toLowerCase() : ''}-`)) return channel.send({ content: 'Failed to close ticket, please try again in 10 minutes' });
				if (data.voiceticket !== 'false') {
					const voiceticket = await guild.channels.cache.get(data.voiceticket);
					voiceticket.delete().catch(err => client.logger.warn(err.stack));
					await client.setData('ticketdata', 'channelId', channel.id, 'voiceticket', 'false');
				}
				await client.setData('ticketdata', 'channelId', channel.id, 'resolved', 'false');
				await data.users.forEach(userid => channel.permissionOverwrites.edit(guild.members.cache.get(userid), { ViewChannel: false }));
				const messages = await channel.messages.fetch({ limit: 100 });
				const link = await getTranscript(messages);
				const users = [];
				await data.users.forEach(userid => users.push(guild.members.cache.get(userid)));
				const CloseDMEmbed = new EmbedBuilder()
					.setColor(Math.floor(Math.random() * 16777215))
					.setTitle(`Closed ${channel.name}`)
					.addFields([
						{ name: '**Transcript**', value: `${link}` },
						{ name: '**Closed by**', value: 'Automatically closed' },
					]);
				if (users[0]) CloseDMEmbed.addFields([{ name: '**Users in ticket**', value: `${users}` }]);
				client.logger.info(`Created transcript of ${channel.name}: ${link}`);
				users.forEach(usr => {
					usr.send({ embeds: [CloseDMEmbed] })
						.catch(err => client.logger.warn(err));
				});
				const resolveEmbed = new EmbedBuilder()
					.setColor(0x2f3136)
					.setDescription('Automatically closed Resolved Ticket');
				const srvconfig = await client.getData('settings', 'guildId', guild.id);
				if (srvconfig.tickets == 'buttons') {
					const row = new ActionRowBuilder()
						.addComponents([
							new ButtonBuilder()
								.setCustomId('delete_ticket')
								.setLabel('Delete Ticket')
								.setEmoji({ name: '⛔' })
								.setStyle(ButtonStyle.Danger),
							new ButtonBuilder()
								.setCustomId('reopen_ticket')
								.setLabel('Reopen Ticket')
								.setEmoji({ name: '🔓' })
								.setStyle(ButtonStyle.Primary),
						]);
					channel.send({ embeds: [resolveEmbed], components: [row] });
				}
				else if (srvconfig.tickets == 'reactions') {
					resolveEmbed.setColor(0x2f3136);
					resolveEmbed.setDescription('🔓 Reopen Ticket `/open`\n⛔ Delete Ticket `/delete`');
					const Panel = await channel.send({ embeds: [resolveEmbed] });
					Panel.react('🔓');
					Panel.react('⛔');
				}
				client.logger.info(`Closed resolved ticket #${channel.name}`);
			}
		});
	});
};