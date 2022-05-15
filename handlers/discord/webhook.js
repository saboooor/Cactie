const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const YAML = require('yaml');
const { con } = YAML.parse(fs.readFileSync('./config.yml', 'utf8'));
const addVote = require('../../functions/addVote');
module.exports = client => {
	if (!con.vote) return client.logger.info('Skipped webhook server loading!');
	app.use(bodyParser.json());
	// on post to server check if authorization matches
	app.post('/', async function(req, res) {
		if (req.headers.authorization === con.vote.auth) {
			res.json({ message: 'pog' });
			await addVote(req.body, client);
		}
		else {
			res.statusCode = 401;
		}
	});
	app.listen(con.vote.webhook, () => client.logger.info(`Webhook server loaded on port ${con.vote.webhook}`));
};