module.exports = async (client, reaction, user) => {
	if (user.bot) return;
	const message = await reaction.message.fetch();
	if (message.channel.id == '678391804563030031' || message.channel.id == '717262907712471080' || message.channel.id == '843372772159389728') {
		if (reaction.emoji.name == '❗') {
			reaction.users.remove(user.id);
			client.commands.get('alerts').execute(message, user, client, reaction);
		}
		else if (reaction.emoji.name == '📘') {
			reaction.users.remove(user.id);
			client.commands.get('vnext').execute(message, user, client, reaction);
		}
		else if (reaction.emoji.name == '🏆') {
			reaction.users.remove(user.id);
			client.commands.get('vtotal').execute(message, user, client, reaction);
		}
	}
	if (message.channel.id == '678391804563030031' || message.channel.id == '851385490821087252') {
		if (reaction.emoji.name == '🔞') {
			reaction.users.remove(user.id);
			client.commands.get('nsfw').execute(message, user, client, reaction);
		}
	}
	if (message.channel.id == '843372772159389728') {
		if (reaction.emoji.name == '🔔') {
			reaction.users.remove(user.id);
			client.commands.get('event').execute(message, user, client, reaction);
		}
	}
	if (message.channel.type == 'DM') return;
	if (reaction.emoji.name == '🎫') {
		if (message.embeds[0].title !== 'Need help? No problem!') return;
		reaction.users.remove(user.id);
		client.commands.get('nsfw').execute(message, user, client, reaction);
	}
	else if (reaction.emoji.name == '⛔') {
		client.commands.get('delete').execute(message, user, client, reaction);
	}
	else if (reaction.emoji.name == '🔓') {
		reaction.users.remove(user.id);
		client.commands.get('open').execute(message, user, client, reaction);
	}
	else if (reaction.emoji.name == '🔒') {
		reaction.users.remove(user.id);
		client.commands.get('close').execute(message, user, client, reaction);
	}
};