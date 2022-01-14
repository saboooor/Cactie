const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { webhookport, voteauth, gitauth } = require('../config/bot.json');
const addVote = require('../functions/addVote');
const gitUpdate = require('../functions/gitUpdate');
module.exports = client => {
	if (!webhookport) return client.logger.info('Skipped webhook server loading!');
	app.use(bodyParser.json());
	// on post to server check if authorization matches
	app.post('/', async function(req, res) {
		if (req.headers.authorization === voteauth) {
			res.json({ message: 'pog' });
			await addVote(req.body, client);
		}
		else if (req.headers.authorization === gitauth) {
			res.json({ message: 'pog' });
			gitUpdate(req.body, client);
		}
		else {
			res.statusCode = 401;
		}
	});
	app.listen(webhookport, () => client.logger.info(`Webhook server loaded on port ${webhookport}`));
};