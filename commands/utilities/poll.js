const { MessageEmbed } = require('discord.js');
const { yes, no } = require('../../config/emoji.json');
module.exports = {
	name: 'poll',
	description: 'Create a poll!\nIt is recommended to use /poll instead',
	cooldown: 10,
	args: true,
	usage: '<Question>',
	guildOnly: true,
	options: require('../options/question.json'),
	async execute(message, args, client) {
		let channel = message.guild.channels.cache.find(c => c.name.includes('poll'));
		const srvconfig = client.settings.get(message.guild.id);
		if (srvconfig.pollchannel == 'false') channel = message.channel;
		else if (srvconfig.pollchannel != 'default') channel = client.channels.cache.get(srvconfig.pollchannel);
		else if (!channel) channel = message.channel;
		const Poll = new MessageEmbed()
			.setColor(3447003)
			.setTitle('Poll')
			.setAuthor(message.member.user.username, message.member.user.avatarURL())
			.setDescription(args.join(' '));
		const msg = await channel.send({ embeds: [Poll] });
		await msg.react(yes);
		await msg.react(no);
		if (channel === message.channel && message.commandName) return message.reply({ content: '**Poll Created!**', ephemeral: true });
		if (channel === message.guild.channels.cache.find(c => c.name.includes('poll'))) return message.reply({ content: `**Poll Created! Check ${channel}**` });
	},
};