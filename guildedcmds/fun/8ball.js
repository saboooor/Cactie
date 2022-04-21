module.exports = {
	name: '8ball',
	description: 'Let the 8 ball decide your fate!',
	args: true,
	usage: '<Question>',
	async execute(message, args, client, lang) {
		try {
			// Get the array of 8 ball responses
			const ball = require(`../../lang/${lang.language.name}/8ball.json`);

			// Get random index and reply with the string in the array of the index
			const i = Math.floor(Math.random() * ball.length);
			message.reply(`🎱 **${args.join(' ')}?**\n \`${ball[i]}\``);
		}
		catch (err) { client.error(err, message); }
	},
};