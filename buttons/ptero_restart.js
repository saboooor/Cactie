const ptero = require('../functions/ptero.js');
module.exports = {
	name: 'ptero_restart',
	async execute(interaction, client) {
		// Call the ptero function with restart command
		ptero(interaction, client, 'restart');
	},
};