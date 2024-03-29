import { Client, CommandInteraction, EmbedBuilder, Message } from 'discord.js';

export default async function redditFetch(subreddits: string[], message: CommandInteraction | Message, client: Client, attempts: number = 1): Promise<void> {
  // Get a random subreddit from the array of subreddits
  const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

  // err if something goes wrong
  let err;

  // Fetch a random post from the subreddit
  logger.info(`Fetching an image from r/${subreddit}... (attempt ${attempts})`);
  const json = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`).catch(e => err = e);

  // If there is nothing or an error, return with an error
  if (!json || err) {
    error(`Ran into a problem, please try again later\nhttps://www.reddit.com/r/${subreddit}/random.json${err ? `${err}\n` : ''}`, message);
    return;
  }

  // Parse into json
  let pong = await json.json().catch((e: Error) => err = e);

  // If there is nothing or an error, return ith an error
  if (!pong) {
    error(`Ran into a problem, please try again later\nhttps://www.reddit.com/r/${subreddit}/random.json${err ? `${err}\n` : ''}`, message);
    return;
  }

  // If subreddit isn't found, return with error
  if (pong.message == 'Not Found') {
    error(`r/${subreddit} doesn't exist!`, message);
    return;
  }

  // If data is an array, set it to the first element in the array
  if (pong[0]) pong = pong[0];

  // Something really rare
  if (!pong) {
    logger.error(JSON.stringify(pong));
    error('Invalid data! Try again later.', message);
    return;
  }

  // Get the specific post's data
  const data = pong.data.children[0].data;

  // Check if the post has text and no media
  if (data.selftext || data.url.endsWith('.gifv')) return redditFetch(subreddits, message, client, attempts + 1);

  // Check if flair has help or question or anything like that, we don't want to see dogs dying :(
  if (data.title.includes('?')
	|| (data.link_flair_text && ['help', 'que'].some(flair => data.link_flair_text.toLowerCase().includes(flair)))) return redditFetch(subreddits, message, client, attempts + 1);

  // Log the url
  logger.info(`Image URL: ${data.url}`);

  // Check if the url is one that Cactie cannot parse
  if (!['i.redd.it', 'v.redd.it', 'i.imgur.com', 'redgifs.com/watch/'].some(url => data.url.includes(url))) {
    logger.error('Can\'t parse URL!');
    return redditFetch(subreddits, message, client, attempts + 1);
  }

  // If the post is NSFW, retry as NSFW is not allowed.
  if (data.over_18) return redditFetch(subreddits, message, client, attempts + 1);

  // Get the timestamp of when the post was created
  const timestamp = parseInt(`${data.created}` + '000');

  // Create embed for reddit post
  const PostEmbed = new EmbedBuilder()
    .setColor('Random')
    .setAuthor({ name: `u/${data.author}`, url: `https://reddit.com/u/${data.author}` })
    .setTitle(data.title)
    .setDescription(`**${data.ups} Upvotes** (${data.upvote_ratio * 100}%)`)
    .setURL(`https://reddit.com${data.permalink}`)
    .setFooter({ text: `Fetched from r/${data.subreddit}${data.link_flair_text ? ` • Flair: ${data.link_flair_text}` : ''}` })
    .setTimestamp(timestamp);

  // Check if the url is a video from reddit
  if (data.url.includes('v.redd.it')) data.url = `${data.url}/DASH_480.mp4?source=fallback`;

  // Set the image to the url
  PostEmbed.setImage(data.url);

  // Upload mp4 if url ends with mp4
  let files;
  if (data.url.endsWith('.mp4') || data.url.endsWith('DASH_480.mp4?source=fallback')) files = [{ attachment: data.url, name: data.url.split('/').pop() }];

  // Send the message
  message.reply({ embeds: [PostEmbed], files }).catch(err => {
    logger.error(err);
    return redditFetch(subreddits, message, client, attempts + 1);
  });
}
