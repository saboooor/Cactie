const checkPerms = require('../../functions/checkPerms');
const createTicket = require('../../functions/tickets/createTicket.js');
const closeTicket = require('../../functions/tickets/closeTicket.js');
const deleteTicket = require('../../functions/tickets/deleteTicket.js');
const reopenTicket = require('../../functions/tickets/reopenTicket.js');
const createVoice = require('../../functions/tickets/createVoice.js');

module.exports = async (client, reaction, user) => {
	// Check if author is a bot or guild is undefined
	if (user.bot || !reaction.message.guildId) return;

	// Get the guild of the reaction
	const guild = await client.guilds.fetch(reaction.message.guildId);

	// Check if the bot has permission to manage messages
	const permCheck = checkPerms(['ReadMessageHistory'], guild.members.me, reaction.message.channelId);
	if (permCheck) return;

	// Fetch the reaction's message
	const message = await reaction.message.fetch().catch(err => logger.error(err));

	// Get the reaction's emoji
	const emojiId = reaction.emoji.id ?? reaction.emoji.name;

	// Get the member
	const member = await guild.members.fetch(user.id).catch(err => logger.error(err));

	// Get current settings for the guild and check if tickets are enabled
	const srvconfig = await client.getData('settings', { guildId: guild.id });
	if (!srvconfig.tickets) return;

	try {
		if (emojiId == '🎫') {
			if (message.embeds[0] && message.embeds[0].title !== 'Need help? No problem!') return;
			await createTicket(client, srvconfig, member);
			await reaction.users.remove(member.id);
		}
		else if (emojiId == '⛔') {
			await deleteTicket(client, srvconfig, member, message.channel);
		}
		else if (emojiId == '🔓') {
			await reopenTicket(client, srvconfig, member, message.channel);
			await reaction.users.remove(member.id);
		}
		else if (emojiId == '🔒') {
			if (message.embeds[0] && !message.embeds[0].title.includes('Ticket Created')) return;
			await closeTicket(client, srvconfig, member, message.channel);
			await reaction.users.remove(member.id);
		}
		else if (emojiId == '🔊') {
			if (message.embeds[0] && message.embeds[0].title !== 'Ticket Created') return;
			await createVoice(client, srvconfig, member, message.channel);
			await reaction.users.remove(member.id);
		}
	}
	catch (err) {
		const msg = await client.error(err, message, true);
		await sleep(5000);
		await msg.delete();
	}
};