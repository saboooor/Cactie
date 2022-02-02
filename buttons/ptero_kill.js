const ptero = require('../functions/ptero/ptero.js');
module.exports = {
	name: 'ptero_kill',
	async execute(interaction, client) {
		interaction.reply = interaction.editReply;
		try {
			// Call the ptero function with kill command
			ptero(interaction, client, 'kill');
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};