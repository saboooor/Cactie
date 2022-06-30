module.exports = {
	name: 'music_pause',
	player: true,
	playing: true,
	srvunmute: true,
	invc: true,
	samevc: true,
	async execute(interaction, client, lang) {
		try { client.commands.get('pause').execute(interaction, [], client, lang); }
		catch (err) { client.error(err, interaction); }
	},
};