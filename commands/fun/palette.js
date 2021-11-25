const { MessageEmbed } = require('discord.js');
const { getPalette } = require('colorthief');
const rgb2hex = require('../../functions/rgbhexpalette');
module.exports = {
	name: 'palette',
	description: 'Get a palette of colors from an image URL',
	args: true,
	usage: '<Image URL>',
	options: require('../options/imgurl.json'),
	async execute(message, args) {
		// Get the color from the img url
		const colors = rgb2hex(await getPalette(args[0]));
		const embeds = [];
		colors.forEach(color => {
			// Create embed with color and reply with it
			const Embed = new MessageEmbed()
				.setColor(color)
				.setDescription(`${color}`);
			embeds.push(Embed);
		});
		message.reply({ embeds: embeds });
	},
};