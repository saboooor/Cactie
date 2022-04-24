const { SlashCommandStringOption } = require('discord.js');
module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('type')
			.setDescription('The type of help you need')
			.setChoices(
				{ name: 'Admin', value: 'admin' },
				{ name: 'Fun', value: 'fun' },
				{ name: 'Animals', value: 'animals' },
				{ name: 'Music', value: 'music' },
				{ name: 'NSFW', value: 'nsfw' },
				{ name: 'Tickets', value: 'tickets' },
				{ name: 'Utilities', value: 'utilities' },
				{ name: 'Support Panel (Admin only)', value: 'supportpanel' },
				{ name: 'Actions', value: 'actions' },
			),
	);
};