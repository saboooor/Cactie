module.exports = {
	name: 'ping',
	description: 'Pong!',
	aliases: ['pong'],
	cooldown: 10,
	async execute(message, args, client, lang) {
		try {
			// reply with message
			message.reply(`**Pong!** \`${lang.ping.latency}: ${Date.now() - message.createdAt}ms\``);
		}
		catch (err) { client.error(err, message); }
	},
};