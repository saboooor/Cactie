const { Embed } = require('discord.js');
module.exports = {
	name: 'volume',
	aliases: ['v', 'vol'],
	description: 'Change volume of currently playing music',
	voteOnly: true,
	usage: '[Volume]',
	cooldown: 5,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	options: require('../options/volume.json'),
	async execute(message, args, client) {
		try {
			// Get player and if arg isn't set, reply with current volume
			const player = client.manager.get(message.guild.id);
			if (!args.length) {
				const VolEmbed = new Embed()
					.setColor(Math.round(Math.random() * 16777215))
					.setDescription(`🔊 The current volume is: **${player.volume}%**`)
					.setTimestamp();
				return message.reply({ embeds: [VolEmbed] });
			}

			// Parse arg as number and if volume isn't between 0 and 100, reply with error
			const volume = Number(args[0]);
			if (!volume || volume < 0 || volume > 100) {
				const VolEmbed = new Embed()
					.setColor(0xE74C3C)
					.setDescription('Usage: /volume <Number of volume between 0 - 100>');
				return message.reply({ embeds: [VolEmbed] });
			}

			// Set the volume and reply
			player.setVolume(volume);
			const VolEmbed = new Embed()
				.setColor(Math.round(Math.random() * 16777215))
				.setDescription(`🔊 Volume set to: **${volume}%**`)
				.setTimestamp();
			message.reply({ embeds: [VolEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};