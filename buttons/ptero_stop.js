const ptero = require('../functions/ptero.js');
module.exports = {
	name: 'ptero_stop',
	async execute(interaction, client) {
		ptero(interaction, client, 'stop');
	},
};