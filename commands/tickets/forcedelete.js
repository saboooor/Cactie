const { MessageEmbed } = require('discord.js');
const getTranscript = require('../../functions/getTranscript.js');
module.exports = {
	name: 'forcedelete',
	description: 'Force delete a ticket',
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	botperms: 'MANAGE_CHANNELS',
	async execute(message, user, client, reaction) {
		let author = message.member.user;
		if (reaction) {
			if (message.author.id != client.user.id) return;
			author = user;
		}
		const srvconfig = await client.getSettings(message.guild.id);
		if (message.channel.name.startsWith(`Subticket${client.user.username.replace('Pup', '') + ' '}`) && message.channel.parent.name.startsWith(`ticket${client.user.username.replace('Pup', '').replace(' ', '').toLowerCase()}-`)) return message.reply(`This is a subticket!\nYou must use this command in ${message.channel.parent}`);
		if (!client.tickets.get(message.channel.id) || !client.tickets.get(message.channel.id).opener) return;
		if (srvconfig.tickets == 'false') return message.reply({ content: 'Tickets are disabled!' });
		const messages = await message.channel.messages.fetch({ limit: 100 });
		const link = await getTranscript(messages);
		const users = [];
		await client.tickets.get(message.channel.id).users.forEach(userid => users.push(client.users.cache.get(userid)));
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle(`Deleted ${message.channel.name}`)
			.addField('**Users in ticket**', `${users}`)
			.addField('**Transcript**', `${link}.txt`)
			.addField('**Deleted by**', `${author}`);
		if (srvconfig.ticketlogchannel != 'false') client.channels.cache.get(srvconfig.ticketlogchannel).send({ embeds: [Embed] });
		users.forEach(usr => {
			usr.send({ embeds: [Embed] })
				.catch(error => { client.logger.warn(error); });
		});
		client.logger.info(`Created transcript of ${message.channel.name}: ${link}.txt`);
		client.logger.info(`Deleted ticket #${message.channel.name}`);
		await message.channel.delete();
	},
};