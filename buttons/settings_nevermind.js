module.exports = {
	name: 'settings_nevermind',
	async execute(interaction) {
		// Get rid of buttons from message
		interaction.reply({ components: [] });
	},
};