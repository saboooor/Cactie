const Discord = require('discord.js');
module.exports = {
	name: 'changelog',
	description: 'Post a changelog',
	aliases: ['cl'],
	args: true,
	usage: '<Server> <Changes (split with new line)>',
	async execute(message, args, client) {
		const changes = args.join(' ').replace(args[0] + ' ', '').split('\n');
		const Embed = new Discord.MessageEmbed()
			.setAuthor('Changelog', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/298/scroll_1f4dc.png')
			.setFooter(`By ${message.author.username}`, message.author.avatarURL());
		if (args[0] == 'nd') {
			if (!client.guilds.cache.get('865519986806095902').members.cache.get(message.member.id)) return message.reply({ content: 'You can\'t do that!' });
			if (!client.guilds.cache.get('865519986806095902').members.cache.get(message.member.id).roles.cache.has('865533361152589824')) return message.reply({ content: 'You can\'t do that!' });
			changes.forEach(change => {
				Embed.setColor(Math.floor(Math.random() * 16777215));
				Embed.setDescription(change);
				client.channels.cache.get('865522730270326794').send({ embeds: [Embed] });
				client.channels.cache.get('865525620950564864').send({ content: `bcast &4&lNEW UPDATE &#444444•&c ${change}` });
				client.channels.cache.get('865525653738749983').send({ content: `bcast &4&lNEW UPDATE &#444444•&c ${change}` });
				client.channels.cache.get('865525634780758056').send({ content: `bcast &4&lNEW UPDATE &#444444•&c ${change}` });
				client.channels.cache.get('865525676693913660').send({ content: `bcast &4&lNEW UPDATE &#444444•&c ${change}` });
			});
		}
		else if (args[0] == 'th') {
			if (!client.guilds.cache.get('711661870926397601').members.cache.get(message.member.id)) return message.reply({ content: 'You can\'t do that!' });
			if (!client.guilds.cache.get('711661870926397601').members.cache.get(message.member.id).roles.cache.has('716208607070257162')) return message.reply({ content: 'You can\'t do that!' });
			changes.forEach(change => {
				Embed.setColor(Math.floor(Math.random() * 16777215));
				Embed.setDescription(change);
				client.channels.cache.get('717514613930983445').send({ embeds: [Embed] });
				client.channels.cache.get('744713171067207711').send({ content: `bcast &6[&4&lNEW UPDATE&6]&c ${change}` });
			});
		}
	},
};