const { MessageEmbed } = require('discord.js');
const { jump } = require('../../config/emoji.json');
module.exports = {
	name: 'skipto',
	aliases: ['jump'],
	description: 'Forward song',
	args: true,
	usage: '<Number of song in queue>',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	options: [{
		type: 4,
		name: 'amount',
		description: 'The amount of songs to skip',
		required: true,
	}],
	async execute(message, args) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
		const player = message.client.manager.get(message.guild.id);
		if (!player.queue.current) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription('There is no music playing.');
			return message.reply({ embeds: [thing] });
		}
		const position = Number(args[0]);
		if (!position || position < 0 || position > player.queue.size) {
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`Usage: ${message.client.settings.get(message.guild.id).prefix}skipto <Number of song in queue>`);
			return message.reply({ embeds: [thing] });
		}
		player.queue.remove(0, position - 1);
		player.stop();
		const thing = new MessageEmbed()
			.setDescription(`${jump} Forward **${position}** Songs`)
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp();
		return message.reply({ embeds: [thing] });
	},
};