const createTicket = require('../../functions/tickets/createTicket.js');
const closeTicket = require('../../functions/tickets/closeTicket.js');
module.exports = async (client, reaction, user) => {
	// Check if the reaction was sent by a bot
	if (user.bot) return;

	// Get the reaction's message and check if it's in a guild
	const message = await reaction.message.fetch().catch(err => client.logger.error(err.stack));
	if (!message.guild) return;

	// Get the member
	const member = await message.guild.members.fetch(user.id).catch(err => client.logger.error(err.stack));

	// Get the reaction's emoji
	const emojiId = reaction.emoji.id ?? reaction.emoji.name;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

	// Get the language for the user if specified or guild language
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${message.author.id}'`);
	let lang = require('../../lang/English/msg.json');
	if (message.guild.preferredLocale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (message.guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../lang/${srvconfig.language}/msg.json`);
	if (data[0]) lang = require(`../../lang/${data[0].language}/msg.json`);

	try {
		if (emojiId == '🎫') {
			if (message.embeds[0] && message.embeds[0].title !== 'Need help? No problem!') return;
			await createTicket(client, srvconfig, member);
			await reaction.users.remove(member.id);
		}
		else if (emojiId == '⛔') {
			await client.commands.get('delete').execute(message, member, client, lang, reaction);
		}
		else if (emojiId == '🔓') {
			await client.commands.get('open').execute(message, member, client, lang, reaction);
			await reaction.users.remove(member.id);
		}
		else if (emojiId == '🔒') {
			if (message.embeds[0] && !message.embeds[0].title.includes('icket Created')) return;
			await closeTicket(client, srvconfig, member, message.channel);
			await reaction.users.remove(member.id);
		}
		else if (emojiId == '🔊') {
			if (message.embeds[0] && message.embeds[0].title !== 'Ticket Created') return;
			await client.commands.get('voiceticket').execute(message, member, client, lang, reaction);
			await reaction.users.remove(member.id);
		}
	}
	catch (err) {
		const msg = await client.error(err, message, true);
		await sleep(5000);
		await msg.delete();
	}
};