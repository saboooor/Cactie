const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'react',
	description: 'Adds a reaction to a message',
	ephemeral: true,
	args: true,
	usage: '<Message Link / Id (only in channel)> <Emoji>',
	botperm: 'AddReactions',
	permission: 'Administrator',
	options: require('../options/react.json'),
	async execute(message, args, client) {
		try {
			const ReactEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Reacted to message!');
			const messagelink = args[0].split('/');
			if (!messagelink[4]) messagelink[4] = message.guild.id;
			if (!messagelink[5]) messagelink[5] = message.channel.id;
			if (!messagelink[6]) messagelink[6] = args[0];
			if (messagelink[4] != message.guild.id) return client.error('That message is not in this server!', message, true);
			const channel = await message.guild.channels.cache.get(messagelink[5]);
			if (!channel) return client.error('That channel doesn\'t exist!', message, true);
			const msgs = await channel.messages.fetch({ around: messagelink[6], limit: 1 });
			const fetchedMsg = msgs.first();
			if (!fetchedMsg) return client.error('That message doesn\'t exist!');
			await fetchedMsg.react(args[1]).catch(err => { return client.error(`Reaction failed!\n\`${err}\`\nUse an emote from a server that Pup is in or an emoji.`, message, true); });
			message.reply({ embeds: [ReactEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};