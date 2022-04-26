const { Embed } = require('guilded.js');
module.exports = {
	name: 'eval',
	description: 'Runs code specified in args',
	aliases: ['ec'],
	args: true,
	usage: '<Code>',
	cooldown: 0.1,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		try {
			const embed = new Embed()
				.setTitle('balls');
			message.reply({ embeds: [embed] });
		}
		catch (err) { client.error(err, message); }
	},
};