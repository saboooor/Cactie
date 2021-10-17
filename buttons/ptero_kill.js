const ptero = require('../functions/ptero.js');
module.exports = {
	name: 'ptero_kill',
	async execute(interaction, client) {
		ptero(interaction, client, 'kill');
	},
};