const { EmbedBuilder } = require('discord.js');
const { yes, no } = require('../../lang/int/emoji.json');
const checkPerms = require('../../functions/checkPerms');

module.exports = {
	name: 'poll',
	description: 'Create a poll!',
	ephemeral: true,
	cooldown: 10,
	args: true,
	usage: '<Question>',
	options: require('../../options/question.js'),
	async execute(message, args, client) {
		try {
			// Get server config
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

			// Get channel to send poll in
			let channel = message.guild.channels.cache.get(srvconfig.pollchannel);
			if (!channel) channel = message.channel;

			// Check permissions in that channel
			const permCheck = checkPerms(['ViewChannel', 'SendMessages', 'AddReactions'], message.guild.members.me, channel);
			if (permCheck) return client.error(permCheck, message, true);

			// Create poll embed
			const question = args.join(' ');
			const Poll = new EmbedBuilder()
				.setColor(0x2f3136)
				.setTitle('Poll')
				.setAuthor({ name: message.member.user.username, iconURL: message.member.user.avatarURL() })
				.setDescription(question);

			// Send poll message and react
			const pollMsg = await channel.send({ embeds: [Poll] });
			await pollMsg.react(yes);
			await pollMsg.react(no);

			// Send response message if command is slash command or different channel
			if (channel.id == message.channel.id && message.commandName) return message.reply({ content: '**Poll Created!**' });
			if (channel.id != message.channel.id) return message.reply({ content: `**Poll Created at ${channel}!**` });
		}
		catch (err) { client.error(err, message); }
	},
};