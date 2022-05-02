const redditFetch = require('../../../functions/redditFetch.js');
module.exports = {
	name: 'thighs',
	aliases: ['thigh'],
	description: 'r/Thighs, r/ThickThighs, r/thick, r/thighdeology, r/Thigh, r/TheThiccness, r/curvy',
	async execute(message, args, client) {
		try {
			redditFetch(['Thighs', 'ThickThighs', 'thick', 'thighdeology', 'Thigh', 'TheThiccness', 'curvy'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};