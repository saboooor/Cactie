const { SlashCommandSubcommandBuilder } = require('discord.js');
const helpdesc = require('../../../lang/English/helpdesc.json');
module.exports = async function options(cmd) {
	const categories = Object.keys(helpdesc);
	categories.forEach(category => {
		cmd.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName(category)
				.setDescription(helpdesc[category].description),
		);
	});
};