const { EmbedBuilder } = require('discord.js');
const { vol } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'volume',
	aliases: ['v', 'vol'],
	description: 'Change volume of currently playing music',
	voteOnly: true,
	usage: '[Volume]',
	cooldown: 5,
	player: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	djRole: true,
	options: require('../../options/volume.js'),
	async execute(message, args, client, lang) {
		try {
			// Get player and if arg isn't set, reply with current volume
			const player = client.manager.get(message.guild.id);
			if (!args.length) {
				const VolEmbed = new EmbedBuilder()
					.setColor(Math.floor(Math.random() * 16777215))
					.setDescription(`<:volume:${vol}> ${lang.music.volume.current}: **${player.volume}%**`);
				return message.reply({ embeds: [VolEmbed] });
			}

			// Parse arg as number and if volume isn't between 0 and 100, reply with error
			const volume = Number(args[0]);
			if (!volume || volume < 0 || volume > 100) return client.error(lang.music.volume.between, message, true);

			// Set the volume and reply
			player.setVolume(volume);
			const VolEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setDescription(`<:volume:${vol}> ${lang.music.volume.set}: **${volume}%**`);
			message.reply({ embeds: [VolEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};