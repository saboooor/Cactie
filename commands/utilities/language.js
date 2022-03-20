const fs = require('fs');
const languages = fs.readdirSync('./lang').filter(folder => folder != 'int');
const langoptions = require('../options/lang.json');
languages.forEach(language => langoptions[0].choices.push({ name: language, value: language }));
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
module.exports = {
	name: 'language',
	description: 'Change the language of the bot',
	aliases: ['lang'],
	usage: '<Language> [Change default server language (true/false)]',
	args: true,
	options: langoptions,
	async execute(message, args, client) {
		try {
			const lang = capitalizeFirstLetter(args[0].toLowerCase());
			if (!languages.includes(lang)) return message.reply({ content: `**Invalid Language**\nPlease use a language from the list below:\`\`\`yml\n${languages.join(', ')}\`\`\`` });
			await client.setData('memberdata', 'memberId', `${message.member.id}`, 'language', lang);
			message.reply({ content: `**Language set to ${lang}!**` });
		}
		catch (err) { client.error(err, message); }
	},
};