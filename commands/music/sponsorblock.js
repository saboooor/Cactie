const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'sponsorblock',
	description: 'Enables sponsorblock on the player',
	voteOnly: true,
	aliases: ['autoseek'],
	player: true,
	playing: true,
	async execute(message, args, client) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);

			// Send signal to node for sponsorblock
			await player.play(undefined, { skipSegments: ['music_offtopic', 'sponsor', 'intro', 'outro'] });

			// Create embed
			const sbEmbed = new EmbedBuilder()
				.setColor(0x2f3136)
				.setTitle('Sponsorblock enabled!')
				.setDescription('The bot will now skip past irrelevant segments.')
				.setFooter({ text: 'Please note that the track will freeze and skip if the first segment is too long.' });

			// Reply with message
			message.reply({ embeds: [sbEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};