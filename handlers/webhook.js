const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { webhookport, topggauth, dblauth } = require('../config/bot.json');
const addVote = require('../functions/addVote');
module.exports = client => {
	if (!webhookport) return client.logger.info('Skipped webhook server loading!');
	app.use(bodyParser.json());
	// on post to server check if authorization matches
	app.post('/', function(req, res) {
		if (req.headers.authorization === dblauth) {
			res.json({ message: 'pog' });
			addVote(req.body, client);
		}
		if (req.headers.authorization === topggauth) {
			res.json({ message: 'pog' });
			addVote(req.body, client);
		}
		else {
			res.statusCode = 401;
		}
	});
	app.listen(webhookport, () => {
		client.logger.info(`Webhook server loaded on port ${webhookport}`);
	});
};