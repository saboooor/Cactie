const fs = require('fs');
const languages = fs.readdirSync('./lang').filter(folder => folder != 'int');
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
module.exports = {
	name: 'language',
	description: 'Change the language of the bot',
	aliases: ['lang'],
	usage: '<Language>',
	args: true,
	options: require('../options/lang.js'),
	async execute(message, args, client) {
		try {
			if (args[0].toLowerCase() == 'reset') {
				// Delete settings database for guild and reply
				client.delData('memberdata', 'memberId', message.member.id);
				return message.reply({ content: '**Your language has been reset.**' });
			}
			const lang = capitalizeFirstLetter(args[0].toLowerCase());
			if (message.lang.language.name == lang) return message.reply({ content: message.lang.language.alrset });
			if (!languages.includes(lang)) return message.reply({ content: `${message.lang.language.invalid}\`\`\`yml\n${languages.join(', ')}\`\`\`` });
			await client.setData('memberdata', 'memberId', message.member.id, 'language', lang);
			message.lang = require(`../../lang/${lang}/msg.json`);
			message.reply({ content: `**${message.lang.language.set}**` });
		}
		catch (err) { client.error(err, message); }
	},
};