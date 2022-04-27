const { Embed } = require('guilded.js');
module.exports = {
	name: 'avatar',
	description: 'Get the avatar of a user',
	aliases: ['pfp', 'av'],
	async execute(message, args, client) {
		try {
			const UsrEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setAuthor(`${message.member.nickname ? `${message.member.nickname} (${message.member.user.name})` : message.member.user.name}`)
				.setImage(message.member.user.avatar);
			const row = [];
			message.reply({ embeds: [UsrEmbed], components: row });
		}
		catch (err) { client.error(err, message); }
	},
};