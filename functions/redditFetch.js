const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { getColor } = require('colorthief');
const rgb2hex = require('../functions/rgbhex');
module.exports = async (subreddit, message, client) => {
	client.logger.info(`Fetching an image from r/${subreddit}...`);
	const json = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`);
	const pong = await json.json().catch(e => {
		client.logger.error(e);
		message.reply({ content: `Ran into a problem, please try again later\nhttps://www.reddit.com/r/${subreddit}/random.json` });
		return;
	});
	if (!pong) return;
	if (pong.message == 'Not Found') return message.reply({ content: 'Invalid subreddit!' });
	if (!pong[0]) return message.reply({ content: 'Couldn\'t get data! Try again later.' });
	if (pong[0].data.children[0].data.selftext) return require('./redditFetch.js')(subreddit, message, client);
	client.logger.info(`Image URL: ${pong[0].data.children[0].data.url}`);
	if (!pong[0].data.children[0].data.url.includes('i.redd.it') && !pong[0].data.children[0].data.url.includes('i.imgur.com')) return require('./redditFetch.js')(subreddit, message, client);
	if (!message.channel.nsfw && pong[0].data.children[0].data.over_18) return message.react('🔞').catch(e => { client.logger.error(e); });
	const Embed = new MessageEmbed()
		.setColor(rgb2hex(await getColor(pong[0].data.children[0].data.url)))
		.setAuthor({ name: `u/${pong[0].data.children[0].data.author}` })
		.setTitle(`${pong[0].data.children[0].data.title} (${pong[0].data.children[0].data.ups} Upvotes)`)
		.setURL(`https://reddit.com${pong[0].data.children[0].data.permalink}`)
		.setImage(pong[0].data.children[0].data.url)
		.setFooter({ text: `Fetched from r/${pong[0].data.children[0].data.subreddit}, Pup is not responsible for any of these posts` });
	message.reply({ embeds: [Embed] });
};