const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { webhookport, voteauth, gitauth } = require('../config/bot.json');
const addVote = require('../functions/addVote');
const gitUpdate = require('../functions/gitUpdate');
const crypto = require('crypto');
function validatePayload(req, res, next) {
	if(req.method == 'POST') {
		if (!req.rawBody) {
			return next('Request body empty');
		}
		const sig = Buffer.from(req.get('X-Hub-Signature-256') || '', 'utf8');
		const hmac = crypto.createHmac('sha256', gitauth);
		const digest = Buffer.from('sha256' + '=' + hmac.update(req.rawBody).digest('hex'), 'utf8');
		if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
			return next(`Request body digest (${digest}) did not match ${'X-Hub-Signature-256'} (${sig})`);
		}
	}
	return next();
}
module.exports = client => {
	if (!webhookport) return client.logger.info('Skipped webhook server loading!');
	app.use(bodyParser.json());
	app.use(validatePayload);
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