const { EmbedBuilder, MessageAttachment } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
module.exports = {
	name: 'dm',
	description: 'DM someone through Pup bot.',
	cooldown: 0.1,
	async execute(message, args, client) {
		try {
			// Check if user is in pup support guild and has permission to use the command
			const member = client.guilds.cache.get('811354612547190794').members.cache.get(message.member.user.id);
			if (member ? !member.roles.cache.has('849452673156513813') : true) return;

			// Get user and check if they exist
			const user = client.users.cache.get(args[0].replace(/\D/g, ''));
			if (!user) return client.error('Invalid User!', message, true);

			// Check if message has any attachments and add it to the dm (idek if it works now tbh)
			const files = [];
			for (const attachment of message.attachments) {
				const response = await fetch(attachment[1].url, { method: 'GET' });
				const arrayBuffer = await response.arrayBuffer();
				const img = new MessageAttachment(Buffer.from(arrayBuffer), attachment[1].name);
				files.push(img);
			}

			// Send DM to user
			user.send({ content: args.slice(1).join(' '), files: files })
				.catch(err => client.logger.warn(err));

			// Create response embed and respond
			const DMEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setDescription(`**Message sent to ${user}!**\n**Content:** ${args.slice(1).join(' ')}`);
			message.reply({ embeds: [DMEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};