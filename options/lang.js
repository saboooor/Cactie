const { SlashCommandStringOption } = require('discord.js');
const fs = require('fs');
const languages = fs.readdirSync('./lang').filter(folder => folder != 'int');
const choices = [{ name: 'Reset', value: 'reset' }];
languages.forEach(language => choices.push({ name: language, value: language }));

module.exports = async function options(cmd) {
	cmd.addStringOption(
		new SlashCommandStringOption()
			.setName('language')
			.setDescription('The language to change the bot to')
			.setChoices(...choices)
			.setRequired(true),
	);
};