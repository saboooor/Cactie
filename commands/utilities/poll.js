const { MessageEmbed } = require('discord.js');
const { yes, no } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'poll',
	description: 'Create a poll!\nIt is recommended to use /poll instead',
	ephemeral: true,
	cooldown: 10,
	args: true,
	usage: '<Question>',
	botperm: 'ADD_REACTIONS',
	options: require('../options/question.json'),
	async execute(message, args, client) {
		try {
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			let channel = message.guild.channels.cache.get(srvconfig.pollchannel);
			if (!channel) channel = message.channel;
			const Poll = new MessageEmbed()
				.setColor(3447003)
				.setTitle('Poll')
				.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL({ dynamic : true }) })
				.setDescription(args.join(' '));
			const msg = await channel.send({ embeds: [Poll] });
			await msg.react(yes);
			await msg.react(no);
			if (channel === message.channel && message.commandName) return message.reply({ content: '**Poll Created!**' });
			if (channel === message.guild.channels.cache.find(c => c.name.includes('poll'))) return message.reply({ content: `**Poll Created! Check ${channel}**` });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};