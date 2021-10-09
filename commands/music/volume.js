const { MessageEmbed } = require('discord.js');
const { volumehigh, volumelow } = require('../../config/emoji.json');
module.exports = {
	name: 'volume',
	aliases: ['v', 'vol'],
	description: 'Change volume of currently playing music',
	usage: '[Volume]',
	cooldown: 5,
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	options: [{
		type: 4,
		name: 'volume',
		description: 'The volume to set (1-100)',
		required: false,
	}],
	async execute(message, args, client) {
		const player = client.manager.get(message.guild.id);
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply({ embeds: [thing] });
		}
		if (!args.length) {
			const thing = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp()
				.setDescription(`${volumehigh} The current volume is: **${player.volume}%**`);
			return message.reply({ embeds: [thing] });
		}
		const volume = Number(args[0]);
		if (!volume || volume < 0 || volume > 100) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`Usage: ${client.settings.get(message.guild.id).prefix}volume <Number of volume between 0 - 100>`);
			return message.reply({ embeds: [thing] });
		}
		player.setVolume(volume);
		if (volume > player.volume) {
			const thing = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp()
				.setDescription(`${volumehigh} Volume set to: **${volume}%**`);
			return message.reply({ embeds: [thing] });
		}
		else if (volume < player.volume) {
			const thing = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp()
				.setDescription(`${volumelow} Volume set to: **${volume}%**`);
			return message.reply({ embeds: [thing] });
		}
		else {
			const thing = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTimestamp()
				.setDescription(`${volumehigh} Volume set to: **${volume}%**`);
			return message.reply({ embeds: [thing] });
		}
	},
};