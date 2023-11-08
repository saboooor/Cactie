import { Client } from 'discord.js';

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
const app = express();
import addVote from '~/functions/addVote';
import { getGuildConfig } from '~/functions/prisma';

export default (client: Client) => {
  if (!process.env.WEBHOOK_PORT) return logger.info('Skipped webhook server loading!');
  app.use(bodyParser.json());
  // on post to server check if authorization matches
  app.post('/', async function(req: Request, res: Response) {
    if (req.headers.authorization === process.env.VOTE_AUTH) {
      res.json({ message: 'pog' });
      await addVote(req.body, client);
    }
    else if (req.body.guildId) {
      res.json({ message: 'Updating guild config' });
      logger.info(`Updating guild config for ${req.body.guildId}`);
      await getGuildConfig(req.body.guildId);
    }
    else {
      res.statusCode = 401;
    }
  });
  app.listen(process.env.WEBHOOK_PORT, () => logger.info(`Webhook server loaded on port ${process.env.WEBHOOK_PORT}`));
};