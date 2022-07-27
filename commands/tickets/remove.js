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
			// Check if channel is a thread and set the channel to the parent channel
			if (message.channel.isThread()) message.channel = message.channel.parent;

			// Check if ticket is an actual ticket
			const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
			if (!ticketData) return;
			if (ticketData.users) ticketData.users = ticketData.users.split(',');

			// Check if user is valid
			const member = message.guild.members.cache.get(args[0].replace(/\D/g, ''));
			if (!member) return client.error(lang.invalidmember, message, true);

			// Add user to ticket
			const msg = await manageUsers(client, message.member, message.channel, member);

			// Send message
			await message.reply(msg);
		}
		catch (err) { client.error(err, message); }
	},
};