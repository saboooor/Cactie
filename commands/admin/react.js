const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'react',
	description: 'Adds a reaction to a message',
	ephemeral: true,
	args: true,
	usage: '<Message Link / Id (only in channel)> <Emoji>',
	botperm: 'ADD_REACTIONS',
	permission: 'ADMINISTRATOR',
	options: require('../options/react.json'),
	async execute(message, args) {
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Reacted to message!');
		const messagelink = args[0].split('/');
		if (!messagelink[4]) messagelink[4] = message.guild.id;
		if (!messagelink[5]) messagelink[5] = message.channel.id;
		if (!messagelink[6]) messagelink[6] = args[0];
		if (messagelink[4] != message.guild.id) {
			Embed.setTitle('That message is not in this server!');
			return message.reply({ embeds: [Embed] });
		}
		const channel = await message.guild.channels.cache.get(messagelink[5]);
		if (!channel) {
			Embed.setTitle('That channel doesn\'t exist!');
			return message.reply({ embeds: [Embed] });
		}
		const msgs = await channel.messages.fetch({ around: messagelink[6], limit: 1 });
		const fetchedMsg = msgs.first();
		if (!fetchedMsg) {
			Embed.setTitle('That message doesn\'t exist!');
			return message.reply({ embeds: [Embed] });
		}
		await fetchedMsg.react(args[1]).catch(e => {
			Embed.setTitle('Reaction failed!')
				.setDescription(`\`${e}\`\nUse an emote from a server that Pup is in or an emoji.`);
		});
		message.reply({ embeds: [Embed] });
	},
};