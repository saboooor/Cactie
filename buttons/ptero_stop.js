const ptero = require('../functions/ptero/ptero.js');
module.exports = {
	name: 'ptero_stop',
	async execute(interaction, client) {
		// Call the ptero function with stop command
		ptero(interaction, client, 'stop');
	},
};