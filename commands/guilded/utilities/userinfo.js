const { Embed } = require('guilded.js');
module.exports = {
	name: 'userinfo',
	description: 'Discord member information',
	aliases: ['user', 'u', 'profile', 'memberinfo', 'member'],
	usage: '[User]',
	options: require('../../options/user.js'),
	async execute(message, args, client, lang) {
		try {
			const member = message.member;
			if (!member) return client.error(lang.invalidmember, message, true);
			let roles = member.roleIds;
			roles = roles.map(r => `<@${r}>`);
			if (roles.length > 50) roles = ['Too many roles to list'];
			const UsrEmbed = new Embed()
				.setAuthor({ name: member.nickname ? `${member.nickname} (${member.user.name})` : member.user.name, iconURL: member.user.avatar })
				.setDescription(`<@${member.id}>`)
				.setThumbnail(member.user.avatar);
			if (member.user.banner) UsrEmbed.setImage(member.user.banner);
			UsrEmbed.addFields([
				{ name: 'Joined Server At', value: `\`${member.joinedAt}\`` },
				{ name: 'Created Account At', value: `\`${member.user.createdAt}\`` },
				{ name: 'Roles', value: roles.join(', ') },
			]);
			await message.reply({ embeds: [UsrEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};