import { Command } from 'types/Objects';
import redditFetch from '../../functions/redditFetch';

export const kitty: Command = {
	description: 'kitty meow meow',
	aliases: ['cat', 'kitten'],
	async execute(message, args, client) {
		try { redditFetch(['kitty', 'cat', 'blurrypicturesofcats'], message, client); }
		catch (err) { error(err, message); }
	},
};