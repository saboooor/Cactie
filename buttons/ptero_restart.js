const ptero = require('../functions/ptero.js');
module.exports = {
	name: 'ptero_restart',
	async execute(interaction, client) {
		ptero(interaction, client, 'restart');
	},
};
// Restart button from -ptero