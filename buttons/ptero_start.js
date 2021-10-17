const ptero = require('../functions/ptero.js');
module.exports = {
	name: 'ptero_start',
	async execute(interaction, client) {
		// Call the ptero function with start command
		ptero(interaction, client, 'start');
	},
};