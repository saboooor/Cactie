function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const Discord = require('discord.js');
module.exports = {
	name: 'subticket',
	description: 'Create a subticket.',
	aliases: ['subnew', 'sub'],
	args: true,
	usage: '<Description>',
	guildOnly: true,
	options: [{
		type: 3,
		name: 'message',
		description: 'The message to send on the subticket',
		required: true,
	}],
	async execute(message, args, client, reaction) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		if (reaction && message.author.id != client.user.id) return;
		const srvconfig = client.settings.get(message.guild.id);
		if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '')} `) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply(`This is a subticket!\nYou must use this command in ${message.channel.parent}`);
		if (!client.tickets.get(message.channel.id) || !client.tickets.get(message.channel.id).opener) return;
		if (message.channel.threads.cache.size > 5) return message.reply({ content: 'This ticket has too many subtickets!' });
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		if (message.channel.name.startsWith(`closed${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply({ content: 'This ticket is closed!' });
		const subticket = await message.channel.threads.create({
			name: `Subticket${client.user.username.replace('Pup', '')} ${message.channel.threads.cache.size + 1}`,
			autoArchiveDuration: 1440,
			reason: args[0] ? args.join(' ') : 'Created using a reaction',
		})
			.catch(error => client.logger.error(error));
		if (message.type && message.type == 'APPLICATION_COMMAND') message.reply({ content: `Subticket created at ${subticket}!`, ephemeral: true });
		client.logger.info(`Subticket created at #${subticket.name}`);
		await sleep(1000);
		const users = [];
		await client.tickets.get(message.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
		const Embed = new Discord.MessageEmbed()
			.setColor(3447003)
			.setTitle('Subticket Created')
			.setDescription('Please explain your issue and we\'ll be with you shortly.')
			.addField('Description', args[0] ? args.join(' ') : 'Created using a reaction');
		if (client.settings.get(message.guild.id).tickets == 'buttons') {
			Embed.setFooter(`To close this subticket do ${srvconfig.prefix}close, or click the button below`);
			const row = new Discord.MessageActionRow()
				.addComponents(
					new Discord.MessageButton()
						.setCustomId('close_subticket')
						.setLabel('Close Subticket')
						.setEmoji('🔒')
						.setStyle('DANGER'),
				);
			await subticket.send({ content: `${users}`, embeds: [Embed], components: [row] });
		}
		else if (client.settings.get(message.guild.id).tickets == 'reactions') {
			Embed.setFooter(`To close this subticket do ${srvconfig.prefix}close, or react with 🔒`);
			const embed = await subticket.send({ content: `${users}`, embeds: [Embed] });
			await embed.react('🔒');
		}
		if (srvconfig.ticketmention == 'true') {
			const ping = await subticket.send({ content: '@everyone' });
			await ping.delete();
		}
	},
};