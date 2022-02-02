const ptero = require('../functions/ptero/ptero.js');
module.exports = {
	name: 'ptero_stop',
	async execute(interaction, client) {
		interaction.reply = interaction.editReply;
		try {
			// Call the ptero function with stop command
			ptero(interaction, client, 'stop');
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};