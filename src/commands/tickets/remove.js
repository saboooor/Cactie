const manageUsers = require('../../functions/tickets/manageUsers').default;

module.exports = {
	name: 'remove',
	description: 'Remove someone from a ticket',
	ephemeral: true,
	botPerms: ['ManageChannels'],
	args: true,
	usage: '<User>',
	options: require('../../options/user.js'),
	async execute(message, args, client, lang) {
		try {
			// Check if user is valid
			const targetMember = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!targetMember) return error(lang.invalidmember, message, true);

			// Add user to ticket
			const msg = await manageUsers(message.member, message.channel, targetMember, false);

			// Send message
			await message.reply(msg);
		}
		catch (err) { error(err, message, true); }
	},
};