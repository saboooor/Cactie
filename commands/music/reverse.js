const { rewind } = require('../../lang/int/emoji.json');
const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'reverse',
	description: 'Reverse the queue',
	voteOnly: true,
	aliases: ['rv'],
	cooldown: 2,
	player: true,
	invc: true,
	samevc: true,
	djRole: true,
	async execute(message, args, client, lang) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);

			// Reverse queue and reply
			player.queue.reverse();
			const ReverseEmbed = new EmbedBuilder()
				.setColor('Random')
				.setDescription(`<:rewind:${rewind}> **${lang.music.queue.reversed}**`);
			message.reply({ embeds: [ReverseEmbed] }).catch(err => logger.error(err.stack));
		}
		catch (err) { client.error(err, message); }
	},
};