function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageButton, ActionRow, Embed } = require('discord.js');
const getTranscript = require('../functions/getTranscript.js');
module.exports = {
	name: 'close_ticket',
	botperm: 'MANAGE_CHANNELS',
	deferReply: true,
	async execute(interaction, client) {
		try {
			// Get ticket database
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${interaction.channel.id}'`))[0];
			if (!ticketData) return interaction.reply({ content: 'Could not find this ticket in the database, please manually delete this channel.' });
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if ticket is already closed
			if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'This ticket is already closed!' });

			// Check if user is ticket author
			const author = interaction.user;
			if (author.id != ticketData.opener) return interaction.reply({ content: 'You can\'t close this ticket!' });

			// Change channel name to closed
			interaction.channel.setName(interaction.channel.name.replace('ticket', 'closed'));

			// Check if bot got rate limited and ticket didn't properly close
			await sleep(1000);
			if (interaction.channel.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.reply({ content: 'Failed to close ticket, please try again in 10 minutes' });

			// Check if there's a voice ticket and delete it
			if (ticketData.voiceticket && ticketData.voiceticket !== 'false') {
				const voiceticket = interaction.guild.channels.cache.get(ticketData.voiceticket);
				voiceticket.delete();
				await client.setData('ticketdata', 'channelId', interaction.channel.id, 'voiceticket', 'false');
			}

			// Reset resolved state
			await client.setData('ticketdata', 'channelId', interaction.channel.id, 'resolved', 'false');

			// Remove permissions for each user in the ticket
			ticketData.users.forEach(userid => { interaction.channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: false }); });

			// Get the transcript
			const messages = await interaction.channel.messages.fetch({ limit: 100 });
			const link = await getTranscript(messages);
			client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);

			// Get users and dm them all with ticket close embed
			const users = [];
			await ticketData.users.forEach(userid => users.push(client.users.cache.get(userid)));
			const EmbedDM = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`Closed ${interaction.channel.name}`)
				.addField('**Users in ticket**', `${users}`)
				.addField('**Transcript**', `${link}.txt`)
				.addField('**Closed by**', `${author}`);
			users.forEach(usr => { usr.send({ embeds: [EmbedDM] }); });

			// Reply with ticket close message
			const CloseEmbed = new Embed()
				.setColor(0xFF6400)
				.setDescription(`Ticket Closed by ${author}`);
			let row = null;
			const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
			if (srvconfig.tickets == 'buttons') {
				row = new ActionRow()
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
			}
			interaction.reply({ embeds: [CloseEmbed], components: [row] });
			client.logger.info(`Closed ticket #${interaction.channel.name}`);

			// Check if ticket setting is set to reactions and add the reactions
			if (srvconfig.tickets == 'reactions') {
				Embed.setColor(0x5662f6);
				Embed.setDescription('🔓 Reopen Ticket `/open` `/open`\n⛔ Delete Ticket `/delete` `/delete`');
				const embed = await interaction.channel.send({ embeds: [CloseEmbed] });
				embed.react('🔓');
				embed.react('⛔');
			}
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};