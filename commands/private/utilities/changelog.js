module.exports = {
	name: 'changelog',
	description: 'Post a changelog',
	aliases: ['cl'],
	args: true,
	usage: '<Server> <Changes (split with new line)>',
	async execute(message, args, client, Discord) {
		const changes = args.join(' ').replace(args[0] + ' ', '').split('\n');
		const Embed = new Discord.MessageEmbed()
			.setAuthor('Changelog', 'https://hotemoji.com/images/dl/g/scroll-emoji-by-google.png')
			.setFooter(`By ${message.author.username}`, message.author.avatarURL());
		if (args[0] == 'nd') {
			if (!client.guilds.cache.get('661736128373719141').members.cache.get(message.member.id)) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('661736128373719141').members.cache.get(message.member.id).roles.cache.has('699724468469366844')) return message.reply('You can\'t do that!');
			changes.forEach(change => {
				Embed.setColor(Math.floor(Math.random() * 16777215));
				Embed.setDescription(change);
				client.channels.cache.get('699175256954241095').send(Embed);
				client.channels.cache.get('670774287317073951').send(Embed);
				client.channels.cache.get('676570220298633237').send(`bcast &4&lNEW UPDATE &#444444•&c ${change}`);
			});
		}
		else if (args[0] == 'th') {
			if (!client.guilds.cache.get('711661870926397601').members.cache.get(message.member.id)) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('711661870926397601').members.cache.get(message.member.id).roles.cache.has('716208607070257162')) return message.reply('You can\'t do that!');
			changes.forEach(change => {
				Embed.setColor(Math.floor(Math.random() * 16777215));
				Embed.setDescription(change);
				client.channels.cache.get('717514613930983445').send(Embed);
				client.channels.cache.get('717821332695416843').send(Embed);
				client.channels.cache.get('744713171067207711').send(`bcast &6[&4&lNEW UPDATE&6]&c ${change}`);
			});
		}
		else if (args[0] == 'cs') {
			if (!client.guilds.cache.get('837116518730694678').members.cache.get(message.member.id)) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('837116518730694678').members.cache.get(message.member.id).roles.cache.has('837117859678781451')) return message.reply('You can\'t do that!');
			changes.forEach(change => {
				Embed.setColor(Math.floor(Math.random() * 16777215));
				Embed.setDescription(change);
				client.channels.cache.get('837124270039105546').send(Embed);
				client.channels.cache.get('837122190817230848').send(`bcast &6[&4&lNEW UPDATE&6]&c ${change}`);
				client.channels.cache.get('837122219913379840').send(`bcast &6[&4&lNEW UPDATE&6]&c ${change}`);
				client.channels.cache.get('837122241598324787').send(`bcast &6[&4&lNEW UPDATE&6]&c ${change}`);
			});
		}
		else if (args[0] == 'tb') {
			if (!client.guilds.cache.get('839699515355037697').members.cache.get(message.member.id)) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('839699515355037697').members.cache.get(message.member.id).roles.cache.has('839699515685994545')) return message.reply('You can\'t do that!');
			changes.forEach(change => {
				Embed.setColor(Math.floor(Math.random() * 16777215));
				Embed.setDescription(change);
				client.channels.cache.get('839699515694514243').send(Embed);
				client.channels.cache.get('840609394306973727').send(`bcast &4&lNEW UPDATE &r◆&c ${change}`);
			});
		}
		else if (args[0] == 'network') {
			if (!client.guilds.cache.get('837116518730694678').members.cache.get(message.member.id)) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('837116518730694678').members.cache.get(message.member.id).roles.cache.has('837117859678781451')) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('661736128373719141').members.cache.get(message.member.id)) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('661736128373719141').members.cache.get(message.member.id).roles.cache.has('699724468469366844')) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('839699515355037697').members.cache.get(message.member.id)) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('839699515355037697').members.cache.get(message.member.id).roles.cache.has('839699515685994545')) return message.reply('You can\'t do that!');
			changes.forEach(change => {
				Embed.setColor(Math.floor(Math.random() * 16777215));
				Embed.setDescription(change);
				client.channels.cache.get('837124270039105546').send(Embed);
				client.channels.cache.get('837122190817230848').send(`bcast &6[&4&lNEW UPDATE&6]&c ${change}`);
				client.channels.cache.get('837122219913379840').send(`bcast &6[&4&lNEW UPDATE&6]&c ${change}`);
				client.channels.cache.get('837122241598324787').send(`bcast &6[&4&lNEW UPDATE&6]&c ${change}`);
				client.channels.cache.get('699175256954241095').send(Embed);
				client.channels.cache.get('670774287317073951').send(Embed);
				client.channels.cache.get('676570220298633237').send(`bcast &4&lNEW UPDATE &#444444•&c ${change}`);
				client.channels.cache.get('839699515694514243').send(Embed);
				client.channels.cache.get('840609394306973727').send(`bcast &4&lNEW UPDATE &r◆&c ${change}`);
			});
		}
		else if (args[0] == 'all') {
			if (!client.guilds.cache.get('837116518730694678').members.cache.get(message.member.id)) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('837116518730694678').members.cache.get(message.member.id).roles.cache.has('837117859678781451')) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('661736128373719141').members.cache.get(message.member.id)) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('661736128373719141').members.cache.get(message.member.id).roles.cache.has('699724468469366844')) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('839699515355037697').members.cache.get(message.member.id)) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('839699515355037697').members.cache.get(message.member.id).roles.cache.has('839699515685994545')) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('711661870926397601').members.cache.get(message.member.id)) return message.reply('You can\'t do that!');
			if (!client.guilds.cache.get('711661870926397601').members.cache.get(message.member.id).roles.cache.has('716208607070257162')) return message.reply('You can\'t do that!');
			changes.forEach(change => {
				Embed.setColor(Math.floor(Math.random() * 16777215));
				Embed.setDescription(change);
				client.channels.cache.get('837124270039105546').send(Embed);
				client.channels.cache.get('837122190817230848').send(`bcast &6[&4&lNEW UPDATE&6]&c ${change}`);
				client.channels.cache.get('837122219913379840').send(`bcast &6[&4&lNEW UPDATE&6]&c ${change}`);
				client.channels.cache.get('837122241598324787').send(`bcast &6[&4&lNEW UPDATE&6]&c ${change}`);
				client.channels.cache.get('699175256954241095').send(Embed);
				client.channels.cache.get('670774287317073951').send(Embed);
				client.channels.cache.get('676570220298633237').send(`bcast &4&lNEW UPDATE &#444444•&c ${change}`);
				client.channels.cache.get('839699515694514243').send(Embed);
				client.channels.cache.get('840609394306973727').send(`bcast &4&lNEW UPDATE &r◆&c ${change}`);
				client.channels.cache.get('717514613930983445').send(Embed);
				client.channels.cache.get('717821332695416843').send(Embed);
				client.channels.cache.get('744713171067207711').send(`bcast &6[&4&lNEW UPDATE&6]&c ${change}`);
			});
		}
	},
};