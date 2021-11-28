function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const getTranscript = require('../functions/getTranscript.js');
module.exports = {
	name: 'close_ticket',
	botperms: 'MANAGE_CHANNELS',
	async execute(interaction, client) {
		interaction.deferReply();
		// Get ticket database
		const ticket = client.tickets.get(interaction.channel.id);
		if (!ticket) return interaction.editReply('Could not find this ticket in the database, please manually delete this channel.');

		// Check if ticket is already closed
		if (interaction.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.editReply({ content: 'This ticket is already closed!' });

		// Check if user is ticket author
		const author = interaction.user;
		if (author.id != ticket.opener) return interaction.editReply({ content: 'You can\'t close this ticket!' });

		// Change channel name to closed
		interaction.channel.setName(interaction.channel.name.replace('ticket', 'closed'));

		// Check if bot got rate limited and ticket didn't properly close
		await sleep(1000);
		if (interaction.channel.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return interaction.editReply({ content: 'Failed to close ticket, please try again in 10 minutes' });

		// Check if there's a voice ticket and delete it
		if (ticket.voiceticket && ticket.voiceticket !== 'false') {
			const voiceticket = interaction.guild.channels.cache.get(ticket.voiceticket);
			voiceticket.delete();
			client.tickets.set(interaction.channel.id, 'false', 'voiceticket');
		}

		// Reset resolved state
		client.tickets.set(interaction.channel.id, 'false', 'resolved');

		// Remove permissions for each user in the ticket
		ticket.users.forEach(userid => { interaction.channel.permissionOverwrites.edit(client.users.cache.get(userid), { VIEW_CHANNEL: false }); });

		// Get the transcript
		const messages = await interaction.channel.messages.fetch({ limit: 100 });
		const link = await getTranscript(messages);
		client.logger.info(`Created transcript of ${interaction.channel.name}: ${link}.txt`);

		// Get users and dm them all with ticket close embed
		const users = [];
		await ticket.users.forEach(userid => users.push(client.users.cache.get(userid)));
		const EmbedDM = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle(`Closed ${interaction.channel.name}`)
			.addField('**Users in ticket**', `${users}`)
			.addField('**Transcript**', `${link}.txt`)
			.addField('**Closed by**', `${author}`);
		users.forEach(usr => {
			usr.send({ embeds: [EmbedDM] })
				.catch(error => { client.logger.warn(error); });
		});

		// Reply with ticket close message
		const Embed = new MessageEmbed()
			.setColor(15105570)
			.setDescription(`Ticket Closed by ${author}`);
		let row = null;
		const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);
		if (srvconfig.tickets == 'buttons') {
			row = new MessageActionRow()
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
		interaction.editReply({ embeds: [Embed], components: [row] });
		client.logger.info(`Closed ticket #${interaction.channel.name}`);

		// Check if ticket setting is set to reactions and add the reactions
		if (srvconfig.tickets == 'reactions') {
			Embed.setColor(3447003);
			Embed.setDescription(`🔓 Reopen Ticket \`${srvconfig.prefix}open\` \`/open\`\n⛔ Delete Ticket \`${srvconfig.prefix}delete\` \`/delete\``);
			const embed = await interaction.channel.send({ embeds: [Embed] });
			embed.react('🔓');
			embed.react('⛔');
		}
	},
};