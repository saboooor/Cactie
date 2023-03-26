module.exports = {
	name: 'crash',
	description: 'crashes the bot',
	execute(message, args, client) {
		// Check if user is sab lolololol
		if (message.author.id !== '249638347306303499') return error('You can\'t do that!', message, true);
		throw new Error('Manually Crashed');
	},
};