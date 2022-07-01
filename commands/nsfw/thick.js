const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'thick',
	aliases: ['thicc', 'curvy'],
	description: 'r/ThickThighs, r/thick, r/TheThiccness, r/curvy, r/Thicker',
	async execute(message, args, client) {
		try {
			redditFetch(['ThickThighs', 'thick', 'TheThiccness', 'curvy', 'Thicker'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};