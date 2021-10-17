module.exports = {
	name: 'settings_nevermind',
	async execute(interaction) {
		interaction.update({ components: [] });
	},
};
// This button just gets rid of buttons from the message