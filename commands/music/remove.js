const { MessageEmbed } = require('discord.js');
const { remove } = require('../../config/emoji.json');
module.exports = {
	name: 'remove',
	description: 'Remove a song from the queue',
	aliases: ['rem', 'rm'],
	args: true,
	usage: '<Index of song in queue>',
	guildOnly: true,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	options: [{
		type: 4,
		name: 'index',
		description: 'The number of the song in the queue',
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
		const position = (Number(args[0]) - 1);
		if (position > player.queue.size) {
			const number = (position + 1);
			const thing = new MessageEmbed()
				.setColor('RED')
				.setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
			return message.reply({ embeds: [thing] });
		}
		const song = player.queue[position];
		player.queue.remove(position);
		const thing = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTimestamp()
			.setDescription(`${remove} Removed\n[${song.title}](${song.uri})`);
		return message.reply({ embeds: [thing] });
	},
};