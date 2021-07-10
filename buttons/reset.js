function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const Discord = require('discord.js');
module.exports = {
	name: 'reset',
	permissions: 'ADMINISTRATOR',
	async execute(interaction, client) {
		await sleep('2000');
		const confirm = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('reset_confirm')
					.setLabel('Are you sure you want to reset ALL of your settings?')
					.setStyle('DANGER'),
			);
		interaction.update({ components: [confirm] });
	},
};