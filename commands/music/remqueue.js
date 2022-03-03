const { Embed } = require('discord.js');
const { no } = require('../../lang/int/emoji.json');
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
				const ErrEmbed = new Embed()
					.setColor(0xE74C3C)
					.setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
				return message.reply({ embeds: [ErrEmbed] });
			}

			// Get song from index and remove it and reply
			const song = player.queue[position];
			player.queue.remove(position);
			const RemEmbed = new Embed()
				.setDescription(`<:no:${no}> **Removed**\n[${song.title}](${song.uri})`)
				.setColor(song.color)
				.setTimestamp()
				.setThumbnail(song.img);
			message.reply({ embeds: [RemEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};