module.exports = {
	name: 'crash',
	description: 'Crashes the bot with an empty message (for testing)',
	async execute(message) {
		// Check if user is sab lolololol
		if (message.author.id !== '249638347306303499') return message.reply({ content: 'You can\'t do that!' });
		message.reply({ content: '' });
	},
};