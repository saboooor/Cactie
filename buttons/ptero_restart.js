const ptero = require('../functions/ptero/ptero.js');
module.exports = {
	name: 'ptero_restart',
	async execute(interaction, client) {
		try {
			// Call the ptero function with restart command
			ptero(interaction, client, 'restart');
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};