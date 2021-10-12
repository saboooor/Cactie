const { MessageEmbed } = require('discord.js');
const splashy = require('splashy');
const got = require('got');
module.exports = {
	name: 'palette',
	description: 'Get a hex color palette from an image URL',
	aliases: ['colors'],
	args: true,
	usage: '<Image URL>',
	options: require('../options/palette.json'),
	async execute(message, args) {
		const slash = message.type && message.type == 'APPLICATION_COMMAND';
		const reply = slash ? await message.deferReply() : await message.reply({ content: '<a:loading:826611946258038805> Pup is thinking...' });
		const { body } = await got(args[0], { encoding: null }).catch(error => { return slash ? message.editReply({ content: `${error}` }) : reply.edit({ content: `${error}` }); });
		const palette = await splashy(body);
		const embeds = [];
		palette.forEach(hex => {
			const Embed = new MessageEmbed()
				.setColor(hex)
				.setDescription(hex);
			embeds.push(Embed);
		});
		slash ? message.editReply({ embeds: embeds }) : reply.edit({ content: null, embeds: embeds });
	},
};