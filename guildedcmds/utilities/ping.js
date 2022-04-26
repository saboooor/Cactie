const { Embed } = require('guilded.js');
module.exports = {
	name: 'ping',
	description: 'Pong!',
	aliases: ['pong'],
	cooldown: 10,
	async execute(message, args, client, lang) {
		try {
			// Get the array of pong responses
			const pong = require(`../../lang/${lang.language.name}/pong.json`);

			// Create embed with ping information and add ping again button
			const PingEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(pong[0])
				.setDescription(`**${lang.ping.latency}** ${Date.now() - message.createdAt}ms`);

			// reply with embed
			message.send({ embeds: [PingEmbed], replyMessageIds: [message.id] });
		}
		catch (err) { client.error(err, message); }
	},
};