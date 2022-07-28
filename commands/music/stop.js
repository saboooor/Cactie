const { EmbedBuilder } = require('discord.js');
const { warn } = require('../../lang/int/emoji.json');

module.exports = {
	name: 'stop',
	description: 'Stops the music',
	player: true,
	invc: true,
	samevc: true,
	djRole: true,
	async execute(message, args, client, lang) {
		try {
			// Get player and skip and clear the queue and reply
			const player = client.manager.get(message.guild.id);
			player.stop();
			player.queue.clear();
			const StopEmbed = new EmbedBuilder()
				.setColor('Random')
				.setDescription(`<:alert:${warn}> **${lang.music.stop}**`);
			message.reply({ embeds: [StopEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};