function capFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
const { readdirSync } = require('fs');
const languages = readdirSync('./lang').filter(folder => folder != 'int');

module.exports = {
	name: 'language',
	description: 'Change the language of the bot',
	aliases: ['lang'],
	usage: '<Language>',
	args: true,
	options: require('../../options/lang.js'),
	async execute(message, args, client, lang) {
		try {
			if (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'false') {
				// Delete settings database for guild and reply
				client.delData('memberdata', 'memberId', message.member.id);
				return message.reply({ content: '**Your language has been reset.**' });
			}
			const newlang = capFirstLetter(args[0].toLowerCase());
			if (lang.language.name == newlang) return message.reply({ content: lang.language.alrset });
			if (!languages.includes(newlang)) return message.reply({ content: `${lang.language.invalid}\`\`\`yml\n${languages.join(', ')}\`\`\`` });
			await client.setData('memberdata', 'memberId', message.member.id, 'language', newlang);
			lang = require(`../../lang/${newlang}/msg.json`);
			message.reply({ content: `**${lang.language.set}**` });
		}
		catch (err) { client.error(err, message); }
	},
};