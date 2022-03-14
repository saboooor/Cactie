module.exports = {
	name: 'dmbomb',
	description: 'Broadcasts a message to all server owners.',
	async execute(message, args, client) {
		// Check if user is sab lolololol
		if (!args[0] || message.author.id !== '249638347306303499') return client.error('You can\'t do that!', message, true);
		// Dm all server owners
		await client.guilds.cache.forEach(async guild => {
			const owner = await guild.fetchOwner();
			owner.send(`${owner}\n\n${args.join(' ')}\n\n*You've been sent this message because Pup is in ${guild.name} and you're the owner of the server*`).catch(err => client.logger.error(err));
		});
		message.reply({ content: 'Broadcasted DM to all guild owners!' });
	},
};