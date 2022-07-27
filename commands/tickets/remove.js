const manageUsers = require('../../functions/tickets/manageUsers.js');
module.exports = {
	name: 'remove',
	description: 'Remove someone from a ticket',
	ephemeral: true,
	botperm: 'ManageChannels',
	args: true,
	usage: '<User>',
	similarcmds: 'removesong',
	options: require('../../options/user.js'),
	async execute(message, args, client, lang) {
		try {
			// Check if user is valid
			const targetMember = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!targetMember) return client.error(lang.invalidmember, message, true);

			// Add user to ticket
			const msg = await manageUsers(client, message.member, message.channel, targetMember, false);

			// Send message
			await message.reply(msg);
		}
		catch (err) { client.error(err, message, true); }
	},
};