const { EmbedBuilder } = require('discord.js');
const { no } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'clearqueue',
	description: 'Clear Queue',
	aliases: ['cq'],
	cooldown: 5,
	player: true,
	invc: true,
	samevc: true,
	djRole: true,
	async execute(message, args, client, lang) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);

			// Clear the queue and send message
			player.queue.clear();
			const ClearEmbed = new EmbedBuilder()
				.setColor('Random')
				.setDescription(`<:no:${no}> **${lang.music.queue.cleared}**`)
				.setFooter({ text: message.member.user.tag, iconURL: message.member.user.displayAvatarURL() });
			message.reply({ embeds: [ClearEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};