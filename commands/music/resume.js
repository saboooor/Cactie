module.exports = {
	name: 'resume',
	description: 'Unpause/Pause the currently playing music',
	aliases: ['r', 'unpause'],
	player: true,
	playing: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	djRole: true,
	async execute(message, args, client, lang) {
		try { client.commands.get('pause').execute(message, args, client, lang); }
		catch (err) { client.error(err, message); }
	},
};