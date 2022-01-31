module.exports = {
	name: 'none',
	async execute(interaction, client) {
		try {
			// Do absolutely nothing at all
			interaction.reply();
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};