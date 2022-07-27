const createTicket = require('../../functions/tickets/createTicket.js');
const closeTicket = require('../../functions/tickets/closeTicket.js');
const deleteTicket = require('../../functions/tickets/deleteTicket.js');
const reopenTicket = require('../../functions/tickets/reopenTicket.js');
const createVoice = require('../../functions/tickets/createVoice.js');
module.exports = async (client, reaction, user) => {
	// Check if the reaction was sent by a bot
	if (user.bot) return;

	// Get the reaction's message and check if it's in a guild
	const message = await reaction.message.fetch().catch(err => logger.error(err.stack));
	if (!message.guild) return;

	// Get the member
	const member = await message.guild.members.fetch(user.id).catch(err => logger.error(err.stack));

	// Get the reaction's emoji
	const emojiId = reaction.emoji.id ?? reaction.emoji.name;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

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