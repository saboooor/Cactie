module.exports = {
	name: 'none',
	async execute(interaction, client) {
		try {
			// Do absolutely nothing at all
			interaction.editReply();
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};