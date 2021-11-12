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
		const slash = message.type && message.type == 'APPLICATION_COMMAND';
		const reply = slash ? await message.deferReply() : await message.reply({ content: '<a:loading:826611946258038805> Pup is thinking...' });
		const color = rgb2hex(await getColor(args[0]));
		const Embed = new MessageEmbed()
			.setColor(color)
			.setDescription(color);
		slash ? message.editReply({ embeds: [Embed] }) : reply.edit({ content: null, embeds: [Embed] });
	},
};