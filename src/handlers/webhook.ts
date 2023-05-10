import { Client } from 'discord.js';

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
const app = express();
import addVote from '~/functions/addVote';

export default (client: Client) => {
  if (!process.env.VOTE_WEBHOOK) return logger.info('Skipped webhook server loading!');
  app.use(bodyParser.json());
  // on post to server check if authorization matches
  app.post('/', async function(req: Request, res: Response) {
    if (req.headers.authorization === process.env.VOTE_AUTH) {
      res.json({ message: 'pog' });
      await addVote(req.body, client);
    }
    else {
      res.statusCode = 401;
    }
  });
  app.listen(process.env.VOTE_WEBHOOK, () => logger.info(`Webhook server loaded on port ${process.env.VOTE_WEBHOOK}`));
};