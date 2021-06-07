const fetch = require('node-fetch');
const Discord = require('discord.js');
module.exports = async (subreddit, message) => {
	if (!message.channel.nsfw) return message.react('🔞');
	const json = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`);
	const pong = await json.json();
	const Embed = new Discord.MessageEmbed()
		.setTitle(pong[0].data.children[0].data.title)
		.setURL(`https://reddit.com${pong[0].data.children[0].data.permalink}`)
		.setImage(pong[0].data.children[0].data.url)
		.setFooter(`Fetched from ${pong[0].data.children[0].data.subreddit_name_prefixed}, Pup is not responsible for any of these images`);
	await message.reply(Embed);
};