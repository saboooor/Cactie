const Discord = require('discord.js');
module.exports = async (client, reaction, user) => {
	if (user.bot) return;
	const message = await reaction.message.fetch();
	if (message.channel.id == '678391804563030031' || message.channel.id == '717262907712471080' || message.channel.id == '843372772159389728') {
		if (reaction.emoji.name == '❗') {
			reaction.users.remove(user.id);
			client.commands.get('alerts').execute(message, user, client, Discord, reaction);
		}
		else if (reaction.emoji.name == '📘') {
			reaction.users.remove(user.id);
			client.commands.get('vnext').execute(message, user, client, Discord, reaction);
		}
		else if (reaction.emoji.name == '🏆') {
			reaction.users.remove(user.id);
			client.commands.get('vtotal').execute(message, user, client, Discord, reaction);
		}
	}
	if (message.channel.id == '678391804563030031') {
		if (reaction.emoji.name == '🔞') {
			reaction.users.remove(user.id);
			client.commands.get('nsfw').execute(message, user, client, Discord, reaction);
		}
	}
	if (message.channel.id == '843372772159389728') {
		if (reaction.emoji.name == '🔔') {
			reaction.users.remove(user.id);
			client.commands.get('event').execute(message, user, client, Discord, reaction);
		}
	}
	if (reaction.emoji.name == '❌') {
		if (message.channel.type != 'dm') return;
		if (!message.content.includes('React to this message to unsubscribe to the broadcast')) return;
		if (client.userdata.get(user.id, 'unsubbed') == 'true') return message.channel.send('You\'re already unsubscribed!');
		client.userdata.set(user.id, 'true', 'unsubbed');
		message.channel.send('Unsubscribed!');
	}
	if (message.channel.type == 'dm') return;
	if (reaction.emoji.name == '🎫') {
		if (message.embeds[0].title !== 'Need help? No problem!') return;
		reaction.users.remove(user.id);
		client.commands.get('ticket').execute(message, null, client, Discord, reaction);
	}
	else if (reaction.emoji.name == '⛔') {
		await client.commands.get('delete').execute(message, null, client, Discord, reaction);
	}
	else if (reaction.emoji.name == '🔓') {
		reaction.users.remove(user.id);
		await client.commands.get('open').execute(message, null, client, Discord, reaction);
	}
	else if (reaction.emoji.name == '🔒') {
		reaction.users.remove(user.id);
		client.commands.get('close').execute(message, null, client, Discord, reaction);
	}
};