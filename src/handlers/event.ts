import { Client } from 'discord.js';
import { readdirSync } from 'fs';

export default (client: Client) => {
  const eventFolders = readdirSync('./src/events/');
  let listeners = 0;
  for (const event of eventFolders) {
    const jsFiles = readdirSync(`./src/events/${event}`).filter(subfile => subfile.endsWith('.js') || subfile.endsWith('.ts'));
    for (const file of jsFiles) {
      import(`../events/${event}/${file}`).then(module => {
        const js = module.default ?? module;
        client.on(event, js.bind(null, client));
      });
    }
    listeners += jsFiles.length;
  }
  logger.info(`${listeners} event listeners loaded`);
};