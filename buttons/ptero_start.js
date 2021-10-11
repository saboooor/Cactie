const ptero = require('../functions/ptero.js');
module.exports = {
	name: 'ptero_start',
	async execute(interaction, client) {
		ptero(interaction, client, 'start');
	},
};