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
		let reply = null;
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
			message.deferReply();
		}
		else {
			reply = await message.reply({ content: '<a:loading:826611946258038805> Pup is thinking...' });
		}
		const { body } = await got(args[0], { encoding: null });
		const palette = await splashy(body);
		const embeds = [];
		palette.forEach(hex => {
			const Embed = new MessageEmbed()
				.setColor(hex)
				.setDescription(hex);
			embeds.push(Embed);
		});
		reply ? reply.edit({ content: null, embeds: embeds }) : message.editReply({ embeds: embeds });
	},
};