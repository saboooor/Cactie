function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonComponent, ButtonStyle, ActionRow, Embed } = require('discord.js');
module.exports = {
	name: 'subticket',
	description: 'Create a subticket',
	ephemeral: true,
	aliases: ['subnew', 'sub'],
	args: true,
	usage: '<Description>',
	options: require('../options/ticket.json'),
	botperm: 'CreatePublicThreads',
	async execute(message, args, client, reaction) {
		try {
			if (reaction && message.author.id != client.user.id) return;
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: `This is a subticket!\nYou must use this command in ${message.channel.parent}` });
			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');
			if (message.channel.threads.cache.size > 5) return message.reply({ content: 'This ticket has too many subtickets!' });
			if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
			if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is closed!' });
			const subticket = await message.channel.threads.create({
				name: `Subticket${client.user.username.replace('Pup', '')} ${message.channel.threads.cache.size + 1}`,
				autoArchiveDuration: 1440,
				reason: args[0] ? args.join(' ') : 'Created using a reaction',
			})
				.catch(error => client.logger.error(error));
			if (message.type && message.type == 'APPLICATION_COMMAND') message.reply({ content: `Subticket created at ${subticket}!` });
			client.logger.info(`Subticket created at #${subticket.name}`);
			await sleep(1000);
			const users = [];
			await ticketData.users.forEach(userid => users.push(client.users.cache.get(userid)));
			const CreateEmbed = new Embed()
				.setColor(0x5662f6)
				.setTitle('Subticket Created')
				.setDescription('Please explain your issue and we\'ll be with you shortly.')
				.addField({ name: 'Description', value: args[0] ? args.join(' ') : 'Created using a reaction' });
			if (srvconfig.tickets == 'buttons') {
				CreateEmbed.setFooter({ text: 'To close this subticket do /close, or click the button below' });
				const row = new ActionRow()
					.addComponents(
						new ButtonComponent()
							.setCustomId('close_subticket')
							.setLabel('Close Subticket')
							.setEmoji({ name: '🔒' })
							.setStyle(ButtonStyle.Danger),
					);
				await subticket.send({ content: `${users}`, embeds: [CreateEmbed], components: [row] });
			}
			else if (srvconfig.tickets == 'reactions') {
				CreateEmbed.setFooter({ text: 'To close this subticket do /close, or react with 🔒' });
				const Panel = await subticket.send({ content: `${users}`, embeds: [CreateEmbed] });
				await Panel.react('🔒');
			}
		}
		catch (err) {
			client.error(err, message);
		}
	},
};
