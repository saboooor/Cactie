const { EmbedBuilder } = require('discord.js');
const { nsfw } = require('../lang/int/emoji.json');
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
	if (data.over_18 && !message.channel.nsfw) return message.react(nsfw).catch(err => client.error(err.stack, message));
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
		const gif = await fetch(`https://api.redgifs.com/v2/gifs/${data.url.split('redgifs.com/watch/')[1]}`);
		const gifData = await gif.json();
		if (!gifData.gif || !gifData.gif.urls || !gifData.gif.urls.hd) return redditFetch(subreddits, message, client, attempts + 1);
		data.url = gifData.gif.urls.hd;
		client.logger.info(`Redgifs URL: ${data.url}`);
		PostEmbed.setAuthor({ name: `u/${data.author} (redgifs: @${gifData.gif.userName})`, url: gifData.user.profileUrl.startsWith('http') ? gifData.user.profileUrl : null })
			.setColor(parseInt(gifData.gif.avgColor.replace('#', '0x')))
			.setURL(data.url);
	}
	if (data.url.includes('v.redd.it')) data.url = `${data.url}/DASH_480.mp4?source=fallback`;
	PostEmbed.setImage(data.url);
	let files;
	if (data.url.endsWith('.mp4') || data.url.endsWith('.gifv') || data.url.endsWith('DASH_480.mp4?source=fallback')) files = [{ attachment: data.url, name: data.url.split('/').pop() }];
	message.reply({ embeds: [PostEmbed], files }).catch(err => {
		client.logger.error(err);
		return redditFetch(subreddits, message, client, attempts + 1);
	});
};
