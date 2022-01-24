function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
const { MessageEmbed, MessageAttachment } = require('discord.js');
const ffmpegSync = require('./ffmpegSync.js');
const fs = require('fs');
const retry = require('./redditFetch.js');
module.exports = async function redditFetch(subreddits, message, client, attempts) {
	if (!attempts) attempts = 1;
	if (attempts == 2) message.channel.send({ content: 'This is taking a while, please wait...' });
	const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
	client.logger.info(`Fetching an image from r/${subreddit}... (attempt ${attempts})`);
	const json = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`);
	const pong = await json.json().catch(e => {
		client.logger.error(e);
		return message.reply({ content: `Ran into a problem, please try again later\nhttps://www.reddit.com/r/${subreddit}/random.json` });
	});
	if (!pong) return;
	if (pong.message == 'Not Found') return message.reply({ content: 'Invalid subreddit!' });
	if (!pong[0]) {
		client.logger.error('Couldn\'t get data!');
		client.logger.error(pong);
		return message.reply({ content: 'Couldn\'t get data! Try again later.' });
	}
	const data = pong[0].data.children[0].data;
	if (data.selftext) return retry(subreddits, message, client, attempts + 1);
	client.logger.info(`Image URL: ${data.url}`);
	if (!data.url.includes('i.redd.it') && !data.url.includes('i.imgur.com') && !data.url.includes('redgifs.com/watch/')) return retry(subreddits, message, client, attempts + 1);
	if (!message.channel.nsfw && data.over_18) return message.react('🔞').catch(e => { client.logger.error(e); });
	const Embed = new MessageEmbed()
		.setColor(Math.floor(Math.random() * 16777215))
		.setAuthor({ name: `u/${data.author}`, url: `https://reddit.com/u/${data.author}` })
		.setTitle(data.title)
		.setDescription(`**${data.ups} Upvotes** (${data.upvote_ratio * 100}%)`)
		.setURL(`https://reddit.com${data.permalink}`)
		.setFooter({ text: `Fetched from r/${data.subreddit}` })
		.setTimestamp(parseInt(`${data.created}` + '000'));
	if (data.url.includes('redgifs.com/watch/')) {
		const gif = await fetch(`https://api.redgifs.com/v2/gifs/${data.url.split('redgifs.com/watch/')[1]}`);
		const gifData = await gif.json();
		if (!gifData.gif || !gifData.gif.urls || !gifData.gif.urls.hd) return retry(subreddits, message, client, attempts + 1);
		data.url = gifData.gif.urls.sd;
		client.logger.info(`Redgifs URL: ${data.url}`);
		Embed.setAuthor({ name: `u/${data.author} (redgifs: @${gifData.gif.userName})`, url: gifData.user.profileUrl.startsWith('http') ? gifData.user.profileUrl : null })
			.setColor(gifData.gif.avgColor)
			.setURL(data.url);
	}
	const files = [];
	const timestamp = Date.now();
	const path = `logs/${timestamp}.gif`;
	if (data.url.endsWith('.gifv') || data.url.endsWith('.mp4')) {
		await ffmpegSync(data.url.replace('.gifv', '.mp4'), path);
		files.push(new MessageAttachment(path));
		data.url = `attachment://${timestamp}.gif`;
	}
	Embed.setImage(data.url);
	message.reply({ embeds: [Embed], files: files }).catch(e => {
		client.logger.error(e);
		return retry(subreddits, message, client, attempts + 1);
	});
	await sleep(5000);
	if (fs.existsSync(path)) fs.unlinkSync(path);
};