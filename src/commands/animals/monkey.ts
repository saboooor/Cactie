import { Command } from 'types/Objects';
import redditFetch from '../../functions/redditFetch';

export const monkey: Command = {
	description: '*monke noises*',
	aliases: ['monke', 'monkeys'],
	async execute(message, args, client) {
		try { redditFetch(['monkeys'], message, client); }
		catch (err) { error(err, message); }
	},
};