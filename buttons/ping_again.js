module.exports = {
	name: 'ping_again',
	async execute(interaction, client) {
		const Embed = interaction.message.embeds[0]
			.setColor(Math.floor(Math.random() * 16777215))
			.setDescription(`**Message Latency** ${interaction.createdTimestamp - Date.now()}ms\n**API Latency** ${client.ws.ping}ms`)
			.setTimestamp();
		if (Embed.title == ';-;') Embed.setTitle('Pong!'); else if (Embed.title == 'bruh') Embed.setTitle(';-;');
		else if (Embed.title == 'you can stop now') Embed.setTitle('bruh');
		else if (Embed.title == 'why are you doing this') Embed.setTitle('you can stop now');
		else if (Embed.title == 'Unbelievable Pong!') Embed.setTitle('why are you doing this');
		else if (Embed.title == 'Beyond Godlike!') Embed.setTitle('Unbelievable Pong!');
		else if (Embed.title == 'Godlike!') Embed.setTitle('Beyond Godlike!');
		else if (Embed.title == 'Monster Pong!') Embed.setTitle('Godlike!');
		else if (Embed.title == 'Wicked Sick!') Embed.setTitle('Monster Pong!');
		else if (Embed.title == 'Unstoppable!') Embed.setTitle('Wicked Sick!');
		else if (Embed.title == 'Mega Pong!') Embed.setTitle('Unstoppable!');
		else if (Embed.title == 'Rampage!') Embed.setTitle('Mega Pong!');
		else if (Embed.title == 'Dominating!') Embed.setTitle('Rampage!');
		else if (Embed.title == 'Triple Pong!') Embed.setTitle('Dominating!');
		else if (Embed.title == 'Double Pong!') Embed.setTitle('Triple Pong!');
		else if (Embed.title == 'Pong!') Embed.setTitle('Double Pong!');
		interaction.update({ embeds: [Embed] });
	},
};