import { Client } from 'discord.js';

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
const app = express();
import { readFileSync } from 'fs';
import YAML from 'yaml';
const { con } = YAML.parse(readFileSync('./config.yml', 'utf8'));
import addVote from '~/functions/addVote';

export default (client: Client) => {
  if (!con.vote) return logger.info('Skipped webhook server loading!');
  app.use(bodyParser.json());
  // on post to server check if authorization matches
  app.post('/', async function(req: Request, res: Response) {
    if (req.headers.authorization === con.vote.auth) {
      res.json({ message: 'pog' });
      await addVote(req.body, client);
    }
    else {
      res.statusCode = 401;
    }
  });
  app.listen(con.vote.webhook, () => logger.info(`Webhook server loaded on port ${con.vote.webhook}`));
};