const fetch = require('node-fetch');
const Discord = require('discord.js');
module.exports = {
	name: 'sam',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('./fetch.js')('SamsungGirlr34', message);
	},
};