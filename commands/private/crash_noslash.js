module.exports = {
	name: 'crash',
	description: 'bruh',
	async execute(message) {
		if (message.author.id !== '249638347306303499') return message.reply({ content: 'You can\'t do that!' });
		message.reply('');
	},
};