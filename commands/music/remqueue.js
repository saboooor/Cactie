const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'remqueue',
	description: 'Delete a song from the queue',
	aliases: ['removequeue', 'rmq'],
	args: true,
	usage: '<Index of song in queue>',
	similarcmds: 'remove',
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	options: require('../options/index.json'),
	async execute(message, args, client) {
		try {
			// Get player and index from arg and check if index exists
			const player = client.manager.get(message.guild.id);
			const position = Number(args[0]) - 1;
			if (isNaN(position) || position > player.queue.size) {
				const number = isNaN(position) ? args[0] : position + 1;
				const thing = new MessageEmbed()
					.setColor('RED')
					.setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
				return message.reply({ embeds: [thing] });
			}

			// Get song from index and remove it and reply
			const song = player.queue[position];
			player.queue.remove(position);
			const thing = new MessageEmbed()
				.setDescription(`⏏️ **Removed**\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setTimestamp()
				.setThumbnail(song.img);
			message.reply({ embeds: [thing] });
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};