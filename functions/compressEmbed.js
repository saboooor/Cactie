const { EmbedBuilder } = require('discord.js');
module.exports = function compressEmbed(embed) {
	const lines = embed.description.split('\n');
	const MiniEmbed = new EmbedBuilder()
		.setDescription(`${lines[0]}${lines[1] ? ` ${lines[1]}` : ''}${lines[2] ? ` - ${lines[2]}` : ''}${lines[3] ? `\n${lines[3]}` : ''}`);
	if (embed.color) MiniEmbed.setColor(embed.color);
	if (embed.footer) MiniEmbed.setFooter(embed.footer);
	return MiniEmbed;
};