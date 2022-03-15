function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
module.exports = {
	name: 'subticket',
	description: 'Create a subticket',
	ephemeral: true,
	aliases: ['subnew', 'sub'],
	args: true,
	usage: '<Description>',
	options: require('../options/ticket.json'),
	botperm: 'CREATE_PUBLIC_THREADS',
	async execute(message, args, client, reaction) {
		try {
			if (reaction && message.author.id != client.user.id) return;
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Cactie', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Cactie', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: `This is a subticket!\nYou must use this command in ${message.channel.parent}` });
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');
			if (message.channel.threads.cache.size > 5) return message.reply({ content: 'This ticket has too many subtickets!' });
			if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
			if (message.channel.name.startsWith(`closed${client.user.username.replace('Cactie', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is closed!' });
			const subticket = await message.channel.threads.create({
				name: `Subticket${client.user.username.replace('Cactie', '')} ${message.channel.threads.cache.size + 1}`,
				autoArchiveDuration: 1440,
				reason: args[0] ? args.join(' ') : 'Created using a reaction',
			})
				.catch(error => client.logger.error(error));
			if (message.type && message.type == 'APPLICATION_COMMAND') message.reply({ content: `Subticket created at ${subticket}!` });
			client.logger.info(`Subticket created at #${subticket.name}`);
			await sleep(1000);
			const users = [];
			await ticketData.users.forEach(userid => users.push(client.users.cache.get(userid)));
			const Embed = new MessageEmbed()
				.setColor(3447003)
				.setTitle('Subticket Created')
				.setDescription('Please explain your issue and we\'ll be with you shortly.')
				.addField('Description', args[0] ? args.join(' ') : 'Created using a reaction');
			if (srvconfig.tickets == 'buttons') {
				Embed.setFooter({ text: 'To close this subticket do /close, or click the button below' });
				const row = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('close_subticket')
							.setLabel('Close Subticket')
							.setEmoji('🔒')
							.setStyle('DANGER'),
					);
				await subticket.send({ content: `${users}`, embeds: [Embed], components: [row] });
			}
			else if (srvconfig.tickets == 'reactions') {
				Embed.setFooter({ text: 'To close this subticket do /close, or react with 🔒' });
				const embed = await subticket.send({ content: `${users}`, embeds: [Embed] });
				await embed.react('🔒');
			}
		}
		catch (err) {
			client.error(err, message);
		}
	},
};
