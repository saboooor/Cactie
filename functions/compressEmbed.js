const { Embed } = require('discord.js');
module.exports = function compressEmbed(embed) {
	const lines = embed.description.split('\n');
	const MiniEmbed = new Embed()
		.setDescription(`${lines[0]}${lines[1] ? ` ${lines[1]}` : ''}${lines[2] ? ` - ${lines[2]}` : ''}${lines[3] ? `\n${lines[3]}` : ''}`)
		.setColor(embed.color);
	return MiniEmbed;
};