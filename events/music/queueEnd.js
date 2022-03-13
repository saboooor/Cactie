const { warn } = require('../../lang/int/emoji.json');
const { EmbedBuilder } = require('discord.js');
module.exports = async (client, player) => {
	const guild = client.guilds.cache.get(player.guild);
	const channel = guild.channels.cache.get(player.textChannel);
	const EndEmbed = new EmbedBuilder()
		.setColor(Math.floor(Math.random() * 16777215))
		.setDescription(`<:alert:${warn}> **Music session ended**`);
	const NowPlaying = await channel.send({ embeds: [EndEmbed] });
	player.setNowplayingMessage(NowPlaying);
	player.timeout = Date.now() + 300000;
	client.logger.info(`Timeout set to ${player.timeout}`);
};