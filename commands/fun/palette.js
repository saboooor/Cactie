const { MessageEmbed } = require('discord.js');
const { getPalette } = require('colorthief');
const rgb2hex = require('../../functions/rgbhexpalette');
module.exports = {
	name: 'palette',
	description: 'Get a palette of colors from an image URL',
	args: true,
	usage: '<Image URL>',
	options: require('../options/imgurl.json'),
	async execute(message, args, client) {
		// Get the color from the img url
		const colors = rgb2hex(await getPalette(args[0]).catch(e => {
			client.logger.error(e);
			message.reply(e);
		}));
		const embeds = [];
		colors.forEach(color => {
			// Create embed with color and push it into the list of embeds
			const Embed = new MessageEmbed()
				.setColor(color)
				.setDescription(`${color}`);
			embeds.push(Embed);
			client.logger.info(color);
		});

		// Reply with colors
		message.reply({ embeds: embeds });
	},
};