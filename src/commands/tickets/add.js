const manageUsers = require('../../functions/tickets/manageUsers').default;

module.exports = {
	name: 'add',
	description: 'Add someone to a ticket',
	ephemeral: true,
	botPerms: ['ManageChannels'],
	args: true,
	usage: '<User>',
	options: require('../../options/user').default,
	async execute(message, args) {
		try {
			// Check if user is valid
			const targetMember = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!targetMember) return error("Invalid member! Are they in this server?", message, true);

			// Add user to ticket
			const msg = await manageUsers(message.member, message.channel, targetMember, true);

			// Send message
			await message.reply(msg);
		}
		catch (err) { error(err, message, true); }
	},
};