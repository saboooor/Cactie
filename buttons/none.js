module.exports = {
	name: 'none',
	async execute(interaction, client) {
		interaction.deferUpdate();
	},
};