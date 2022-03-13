function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
const { EmbedBuilder, MessageAttachment } = require('discord.js');
const ffmpegSync = require('./ffmpegSync.js');
const fs = require('fs');
module.exports = async function redditFetch(subreddits, message, client, attempts) {
	if (!attempts) attempts = 1;
	const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
	client.logger.info(`Fetching an image from r/${subreddit}... (attempt ${attempts})`);
	const json = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`).catch(e => {
		client.logger.error(e);
		return message.reply({ content: `Ran into a problem, please try again later\nhttps://www.reddit.com/r/${subreddit}/random.json` });
	});
	const pong = await json.json().catch(e => {
		client.logger.error(e);
		return message.reply({ content: `Ran into a problem, please try again later\nhttps://www.reddit.com/r/${subreddit}/random.json` });
	});
	if (!pong) return;
	if (pong.message == 'Not Found') return message.reply({ content: 'Invalid subreddit!' });
	if (!pong[0]) pong[0] = pong;
	if (!pong[0]) {
		client.logger.error('Couldn\'t get data!');
		client.logger.error(JSON.stringify(pong));
		return message.reply({ content: 'Couldn\'t get data! Try again later.' });
	}
	const data = pong[0].data.children[0].data;
	if (data.selftext) return redditFetch(subreddits, message, client, attempts + 1);
	client.logger.info(`Image URL: ${data.url}`);
	if (!data.url.includes('i.redd.it') && !data.url.includes('v.redd.it') && !data.url.includes('i.imgur.com') && !data.url.includes('redgifs.com/watch/')) return redditFetch(subreddits, message, client, attempts + 1);
	if (!message.channel.nsfw && data.over_18) return message.react('🔞').catch(e => { client.logger.error(e); });
	const PostEmbed = new EmbedBuilder()
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
		if (!gifData.gif || !gifData.gif.urls || !gifData.gif.urls.hd) return redditFetch(subreddits, message, client, attempts + 1);
		data.url = gifData.gif.urls.sd;
		client.logger.info(`Redgifs URL: ${data.url}`);
		PostEmbed.setAuthor({ name: `u/${data.author} (redgifs: @${gifData.gif.userName})`, url: gifData.user.profileUrl.startsWith('http') ? gifData.user.profileUrl : null })
			.setColor(parseInt(gifData.gif.avgColor.replace('#', '0x')))
			.setURL(data.url);
	}
	if (data.url.includes('v.redd.it')) data.url = `${data.url}/DASH_480.mp4?source=fallback`;
	const files = [];
	const timestamp = Date.now();
	const path = `logs/${timestamp}.gif`;
	if (data.url.endsWith('.gifv') || data.url.endsWith('.mp4') || data.url.endsWith('DASH_480.mp4?source=fallback')) {
		await ffmpegSync(data.url.replace('.gifv', '.mp4'), path);
		files.push(new MessageAttachment(path));
		data.url = `attachment://${timestamp}.gif`;
	}
	PostEmbed.setImage(data.url);
	message.reply({ embeds: [PostEmbed], files: files }).catch(e => {
		client.logger.error(e);
		message.reply({ content: `Ran into a problem:\n\`\`\`${e}\`\`\`\nThis is probably due to Discord's 8MB limit, Pup will host the files itself later in the near future` });
	});
	await sleep(5000);
	if (fs.existsSync(path)) fs.unlinkSync(path);
};