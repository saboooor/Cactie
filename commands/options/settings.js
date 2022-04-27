const { SlashCommandSubcommandBuilder } = require('discord.js');
const settingsdesc = require('../../lang/English/settingsdesc.json');
module.exports = async function options(cmd) {
	const settings = Object.keys(settingsdesc);
	settings.forEach(setting => {
		if (setting == 'guildId') return;
		cmd.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName(setting)
				.setDescription(settingsdesc[setting].replace(/\n/g, ' ').replace(/\*/g, '')),
		);
	});
};