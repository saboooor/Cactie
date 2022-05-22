module.exports = async (client, reaction, user) => {
	if (user.bot) return;
	const message = await reaction.message.fetch().catch(err => client.logger.error(err.stack));
	if (!message.channel || message.channel.isDM()) return;
	let emojiId = reaction.emoji.id;
	if (!emojiId) emojiId = reaction.emoji.name;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

	// Get the language for the user if specified or guild language
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${message.author.id}'`);
	let lang = require('../../../lang/English/msg.json');
	if (message.guild.preferredLocale.split('-')[0] == 'en') lang = require('../../../lang/English/msg.json');
	else if (message.guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../../lang/${srvconfig.language}/msg.json`);
	if (data[0]) lang = require(`../../../lang/${data[0].language}/msg.json`);

	if (emojiId == '🎫') {
		if (message.embeds[0] && message.embeds[0].title !== 'Need help? No problem!') return;
		reaction.users.remove(user.id);
		client.commands.get('ticket').execute(message, user, client, lang, reaction);
	}
	else if (emojiId == '⛔') {
		client.commands.get('delete').execute(message, user, client, lang, reaction);
	}
	else if (emojiId == '🔓') {
		reaction.users.remove(user.id);
		client.commands.get('open').execute(message, user, client, lang, reaction);
	}
	else if (emojiId == '🔒') {
		if (message.embeds[0] && !message.embeds[0].title.includes('icket Created')) return;
		reaction.users.remove(user.id);
		client.commands.get('close').execute(message, user, client, lang, reaction);
	}
	else if (emojiId == '📜') {
		if (message.embeds[0] && message.embeds[0].title !== 'Ticket Created') return;
		reaction.users.remove(user.id);
		client.commands.get('subticket').execute(message, user, client, lang, reaction);
	}
	else if (emojiId == '🔊') {
		if (message.embeds[0] && message.embeds[0].title !== 'Ticket Created') return;
		reaction.users.remove(user.id);
		client.commands.get('voiceticket').execute(message, user, client, lang, reaction);
	}
};