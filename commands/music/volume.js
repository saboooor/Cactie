const { MessageEmbed } = require('discord.js');
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
				const thing = new MessageEmbed()
					.setColor(Math.round(Math.random() * 16777215))
					.setDescription(`🔊 The current volume is: **${player.volume}%**`)
					.setTimestamp();
				return message.reply({ embeds: [thing] });
			}

			// Parse arg as number and if volume isn't between 0 and 100, reply with error
			const volume = Number(args[0]);
			if (!volume || volume < 0 || volume > 100) {
				const thing = new MessageEmbed()
					.setColor('RED')
					.setDescription('Usage: /volume <Number of volume between 0 - 100>');
				return message.reply({ embeds: [thing] });
			}

			// Set the volume and reply
			player.setVolume(volume);
			const embed = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setDescription(`🔊 Volume set to: **${volume}%**`)
				.setTimestamp();
			message.reply({ embeds: [embed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};