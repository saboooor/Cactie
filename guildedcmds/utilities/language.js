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
	async execute(message, args, client, lang) {
		try {
			if (args[0].toLowerCase() == 'reset') {
				// Delete settings database for guild and reply
				client.delData('memberdata', 'memberId', message.createdById);
				return message.reply({ content: '**Your language has been reset.**' });
			}
			const newlang = capitalizeFirstLetter(args[0].toLowerCase());
			if (lang.language.name == newlang) return message.reply({ content: lang.language.alrset });
			if (!languages.includes(newlang)) return message.reply({ content: `${lang.language.invalid}\`\`\`yml\n${languages.join(', ')}\`\`\`` });
			await client.setData('memberdata', 'memberId', message.createdById, 'language', newlang);
			lang = require(`../../lang/${newlang}/msg.json`);
			message.reply({ content: `**${lang.language.set}**` });
		}
		catch (err) { client.error(err, message); }
	},
};