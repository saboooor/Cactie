const { FormData } = require('formdata-node');
const { fileFromPath } = require('formdata-node/file-from-path');
const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
const { EmbedBuilder } = require('discord.js');
const ffmpegSync = require('./ffmpegSync.js');
const { nsfw, refresh, warn } = require('../lang/int/emoji.json');
const fs = require('fs');
module.exports = async function redditFetch(subreddits, message, client, attempts) {
	if (!attempts) attempts = 1;
	const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
	client.logger.info(`Fetching an image from r/${subreddit}... (attempt ${attempts})`);
	const json = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`).catch(err => {
		return client.error(`Ran into a problem, please try again later\nhttps://www.reddit.com/r/${subreddit}/random.json\n${err}`, message);
	});
	const pong = await json.json().catch(err => {
		return client.error(`Ran into a problem, please try again later\nhttps://www.reddit.com/r/${subreddit}/random.json\n${err}`, message);
	});
	if (!pong) return;
	if (pong.message == 'Not Found') return client.error(`Invalid subreddit! r/${subreddit}`, message);
	if (!pong[0]) pong[0] = pong;
	if (!pong[0]) {
		client.logger.error(JSON.stringify(pong));
		return client.error('Invalid data! Try again later.', message);
	}
	const data = pong[0].data.children[0].data;
	if (data.selftext) return redditFetch(subreddits, message, client, attempts + 1);
	client.logger.info(`Image URL: ${data.url}`);
	if (!data.url.includes('i.redd.it') && !data.url.includes('v.redd.it') && !data.url.includes('i.imgur.com') && !data.url.includes('redgifs.com/watch/')) return redditFetch(subreddits, message, client, attempts + 1);
	if (data.over_18 && client.type.name == 'discord' && !message.channel.nsfw) return message.react(nsfw).catch(err => client.error(err.stack, message));
	if (data.over_18 && client.type.name == 'guilded' && (await client.channels.fetch(message.channelId)).name.toLowerCase() != 'nsfw') return client.error('The content on this command is NSFW!\nTo view this sensitive content:\n- Execute this command in a channel named \'NSFW\'\n- Create a channel named \'NSFW\'', message, true);
	const timestamp = parseInt(`${data.created}` + '000');
	const PostEmbed = new EmbedBuilder()
		.setColor(Math.floor(Math.random() * 16777215))
		.setAuthor({ name: `u/${data.author}`, url: `https://reddit.com/u/${data.author}` })
		.setTitle(`${data.over_18 ? `<:nsfw:${nsfw}>  ` : ''}${data.title}`)
		.setDescription(`**${data.ups} Upvotes** (${data.upvote_ratio * 100}%)`)
		.setURL(`https://reddit.com${data.permalink}`)
		.setFooter({ text: `Fetched from r/${data.subreddit}` })
		.setTimestamp(timestamp);
	if (data.url.includes('redgifs.com/watch/')) {
		if (client.type.name == 'guilded') return redditFetch(subreddits, message, client, attempts + 1);
		const gif = await fetch(`https://api.redgifs.com/v2/gifs/${data.url.split('redgifs.com/watch/')[1]}`);
		const gifData = await gif.json();
		if (!gifData.gif || !gifData.gif.urls || !gifData.gif.urls.hd) return redditFetch(subreddits, message, client, attempts + 1);
		if (gifData.gif.duration > 20) return redditFetch(subreddits, message, client, attempts + 1);
		data.url = gifData.gif.urls.sd;
		client.logger.info(`Redgifs URL: ${data.url}`);
		PostEmbed.setAuthor({ name: `u/${data.author} (redgifs: @${gifData.gif.userName})`, url: gifData.user.profileUrl.startsWith('http') ? gifData.user.profileUrl : null })
			.setColor(parseInt(gifData.gif.avgColor.replace('#', '0x')))
			.setURL(data.url);
	}
	if (data.url.includes('v.redd.it')) data.url = `${data.url}/DASH_480.mp4?source=fallback`;
	const file = `${timestamp}.gif`;
	PostEmbed.setImage(data.url);
	const msg = await message.reply({ embeds: [PostEmbed] });
	if (data.url.endsWith('.gifv') || data.url.endsWith('.mp4') || data.url.endsWith('DASH_480.mp4?source=fallback')) {
		if (client.type.name == 'guilded') return redditFetch(subreddits, message, client, attempts + 1);
		msg.edit({ content: `<:refresh:${refresh}> **Processing GIF...**` });

		// Convert file to gif
		await ffmpegSync(data.url.replace('.gifv', '.mp4'), file, msg);

		// Check file size
		const stats = fs.statSync(file);
		const fileSizeInBytes = stats.size;
		if (fileSizeInBytes > 50000000) {
			msg.edit({ content: `<:alert:${warn}> **GIF too big**` });
			return redditFetch(subreddits, message, client, attempts + 1);
		}

		msg.edit({ content: `<:refresh:${refresh}> **Uploading GIF...**` });
		// Create form and upload
		const form = new FormData();
		form.set('file', await fileFromPath(file));
		await fetch('https://smhsmh.club/pupupload', { method: 'POST', body: form });
		PostEmbed.setImage(`https://smhsmh.club/pup/${file}`);
		msg.edit({ content: null, embeds: [PostEmbed] });
		fs.unlinkSync(file);
	}
};
