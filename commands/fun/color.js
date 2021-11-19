const { MessageEmbed } = require('discord.js');
const { getColor } = require('colorthief');
const rgb2hex = require('../../functions/rgbhex');
module.exports = {
	name: 'color',
	description: 'Get a color from an image URL',
	args: true,
	usage: '<Image URL>',
	options: require('../options/imgurl.json'),
	async execute(message, args) {
		// Get the color from the img url
		const color = rgb2hex(await getColor(args[0]));

		// Create embed with color and reply with it
		const Embed = new MessageEmbed()
			.setColor(color)
			.setDescription(color);
		message.reply({ embeds: [Embed] });
	},
};