import { Command } from 'types/Objects';
import redditFetch from '../../functions/redditFetch';

export const redpanda: Command = {
	description: 'cute red pandas ya woo',
	aliases: ['redpandas'],
	async execute(message, args, client) {
		try { redditFetch(['redpandas'], message, client); }
		catch (err) { error(err, message); }
	},
};