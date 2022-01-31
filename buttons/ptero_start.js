const ptero = require('../functions/ptero/ptero.js');
module.exports = {
	name: 'ptero_start',
	async execute(interaction, client) {
		try {
			// Call the ptero function with start command
			ptero(interaction, client, 'start');
		}
		catch (err) {
			client.logger.error(err);
		}
	},
};