const { EmbedBuilder } = require('discord.js');
const getColors = require('get-image-colors');
const regex = /\[([^[]+)\](\((.*)\))/g;
module.exports = {
	name: 'color',
	description: 'Get a color or multiple colors from an image',
	usage: '<URL of Image (gif, jpg, png, svg)> [Amount of colors]',
	aliases: ['colors', 'c', 'pick'],
	args: true,
	options: require('../../options/color.js'),
	async execute(message, args, client) {
		try {
			if (args[0] < 1 || args[0] > 5) return client.error('The amount of colors can only be between 1 and 5!', message, true);
			const matches = [...args[0].matchAll(regex)];
			const url = matches ? matches[0][1] : args[0];
			const colors = await getColors(url, { count: args[1] ? parseInt(args[1]) : 1 });
			const embeds = colors.map(color => {
				return new EmbedBuilder()
					.setColor(color.num())
					.setTitle(`**${color.hex()}**`);
			});
			message.reply({ embeds: client.type.name == 'guilded' ? [embeds[0]] : embeds });
		}
		catch (err) { client.error(err, message); }
	},
};