const { EmbedBuilder } = require('discord.js');
const { yes, no } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'poll',
	description: 'Create a poll!',
	ephemeral: true,
	cooldown: 10,
	args: true,
	usage: '<Question>',
	botperm: 'AddReactions',
	options: require('../../options/question.js'),
	async execute(message, args, client) {
		try {
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			let channel = message.guild.channels.cache.get(srvconfig.pollchannel);
			if (!channel) channel = message.channel;
			const Poll = new EmbedBuilder()
				.setColor(0x5662f6)
				.setTitle('Poll')
				.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL() })
				.setDescription(args.join(' '));
			const pollMsg = await channel.send({ embeds: [Poll] });
			await pollMsg.react(yes);
			await pollMsg.react(no);
			if (channel === message.channel && message.commandName) return message.reply({ content: '**Poll Created!**' });
			if (channel === message.guild.channels.cache.find(c => c.name.includes('poll'))) return message.reply({ content: `**Poll Created! Check ${channel}**` });
		}
		catch (err) { client.error(err, message); }
	},
};