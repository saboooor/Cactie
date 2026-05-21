import { Client } from 'discord.js';

import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
const app = express();
import addVote from '~/functions/addVote';

export default (client: Client) => {
  if (!process.env.WEBHOOK_PORT) return logger.info('Skipped webhook server loading!');
  app.use(bodyParser.json());
  // on post to server check if authorization matches
  app.post('/', async function(req: Request, res: Response) {
    if (req.headers.authorization === process.env.VOTE_AUTH) {
      res.json({ message: 'pog' });
      logger.info(`Received vote from ${req.body.user}!`);
      await addVote(req.body, client);
    }
    else {
      res.statusCode = 401;
    }
  });
  app.listen(process.env.WEBHOOK_PORT, () => logger.info(`Webhook server loaded on port ${process.env.WEBHOOK_PORT}`));
};