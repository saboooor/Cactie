const { EmbedBuilder } = require('discord.js');
module.exports = function compressEmbed(embed) {
	const lines = embed.toJSON().description.split('\n');
	const MiniEmbed = new EmbedBuilder()
		.setDescription(`${lines[0]}${lines[1] ? ` ${lines[1]}` : ''}${lines[2] ? ` - ${lines[2]}` : ''}${lines[3] ? `\n${lines[3]}` : ''}`);
	if (embed.toJSON().color) MiniEmbed.setColor(embed.toJSON().color);
	if (embed.toJSON().footer) MiniEmbed.setFooter(embed.toJSON().footer);
	return MiniEmbed;
};