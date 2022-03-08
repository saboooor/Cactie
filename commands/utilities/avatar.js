const { Embed } = require('discord.js');
module.exports = {
	name: 'avatar',
	description: 'Get the avatar of a user',
	aliases: ['pfp', 'av'],
	usage: '[User]',
	options: require('../options/user.json'),
	async execute(message, args, client) {
		try {
			let member = message.member;
			if (args[0]) member = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!member) return message.reply({ content: 'Invalid member!' });
			member.user = await member.user.fetch();
			const UsrEmbed = new Embed()
				.setColor(member.user.accentColor)
				.setAuthor({ name: `${member.displayName != member.user.username ? `${member.displayName} (${member.user.tag})` : member.user.tag}`, iconURL: member.avatarURL() ? member.user.avatarURL({ dynamic : true }) : null })
				.setImage(member.avatarURL() ? member.avatarURL() : member.user.avatarURL());
			await message.reply({ embeds: [UsrEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};