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
	usage: '<Language>',
	args: true,
	options: langoptions,
	async execute(message, args, client) {
		try {
			const lang = capitalizeFirstLetter(args[0].toLowerCase());
			if (message.lang.language.name == lang) return message.channel.send(message.lang.language.alrset);
			if (!languages.includes(lang)) return message.reply({ content: `${message.lang.language.invalid}\`\`\`yml\n${languages.join(', ')}\`\`\`` });
			await client.setData('memberdata', 'memberId', `${message.member.id}`, 'language', lang);
			message.lang = require(`../../lang/${lang}/msg.json`);
			message.reply({ content: `**${message.lang.language.set}**` });
		}
		catch (err) { client.error(err, message); }
	},
};