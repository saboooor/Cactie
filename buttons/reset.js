function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
function minTwoDigits(n) { return (n < 10 ? '0' : '') + n; }
const Discord = require('discord.js');
module.exports = {
	name: 'reset',
	async execute(interaction, client) {
		const button = new Discord.MessageButton()
			.setCustomID('none')
			.setLabel('Please wait 5 seconds..')
			.setStyle('DANGER');
		const row = new Discord.MessageActionRow()
			.addComponents(button);
		interaction.update({ components: [row] });
		await button.setLabel('Are you sure you want to reset ALL of your settings?').setCustomID('reset_confirm');
		await sleep('5000');
		row.addComponents(button);
		interaction.message.edit({ components: [row] });
	},
};