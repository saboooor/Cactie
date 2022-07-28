const { EmbedBuilder } = require('discord.js');
const { refresh } = require('../../lang/int/emoji.json');

module.exports = {
	name: '247',
	description: 'Toggle 24/7 in voice channel',
	voteOnly: true,
	aliases: ['24h', '24/7'],
	cooldown: 5,
	player: true,
	invc: true,
	samevc: true,
	djRole: true,
	async execute(message, args, client, lang) {
		try {
			// Get player and set 24/7 to the opposite of current state and send message
			const player = client.manager.players.get(message.guild.id);
			const twentyFourSevenEmbed = new EmbedBuilder()
				.setColor('Random')
				.setDescription(`<:refresh:${refresh}> **${lang.music.h24[player.twentyFourSeven ? 'off' : 'on']}**`);
			player.twentyFourSeven = !player.twentyFourSeven;
			message.reply({ embeds: [twentyFourSevenEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};
