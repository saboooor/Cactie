const { SlashCommandSubcommandBuilder, SlashCommandChannelOption } = require('discord.js');
const helpdesc = require('../lang/English/helpdesc.json');
module.exports = async function options(cmd) {
	const categories = Object.keys(helpdesc);
	categories.forEach(category => {
		const subcmd = new SlashCommandSubcommandBuilder()
			.setName(category)
			.setDescription(helpdesc[category].description);
		if (category == 'supportpanel') {
			subcmd.addChannelOption(
				new SlashCommandChannelOption()
					.setName('channel')
					.setDescription('The channel to send the support panel to'),
			);
		}
		cmd.addSubcommand(subcmd);
	});
};