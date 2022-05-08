function crash() { return new Promise((resolve, reject) => reject('Manually Crashed')); }
module.exports = {
	name: 'crash',
	description: 'crashes the bot',
	async execute(message, args, client) {
		// Check if user is sab lolololol
		if ((client.type.name == 'guilded' && message.createdById !== 'AYzRpEe4') && message.author.id !== '249638347306303499') return client.error('You can\'t do that!', message, true);

		// Crash the bot
		await crash();
	},
};