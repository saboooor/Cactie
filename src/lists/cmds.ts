import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { SlashCommand } from '~/types/Objects';

// Set the slash commands collection
const slashcommands = new Collection<string, SlashCommand>();
const cooldowns = new Collection<string, Collection<string, number>>();

// Register all slash commands
const slashcommandFolders = readdirSync('./src/commands');
for (const folder of slashcommandFolders) {
  const slashcommandFiles = readdirSync(`./src/commands/${folder}`).filter(file => (file.endsWith('.js') || file.endsWith('ts')) && folder != 'private');
  for (const file of slashcommandFiles) {
    let slashcommand = require(`../commands/${folder}/${file}`);
    const name = Object.keys(slashcommand)[0] as keyof typeof slashcommand;
    slashcommand = { name: slashcommand.name ?? name, category: folder, ...slashcommand[name] };

    if (typeof slashcommand.name == 'string') {
      slashcommands.set(slashcommand.name, slashcommand);
    }
    else {
      for (const cmdname of slashcommand.name) {
        slashcommands.set(cmdname, { ...slashcommand, name: cmdname, description: slashcommand.description.replace('{NAME}', cmdname) });
      }
    }
  }
}
logger.info(`${slashcommands.size} slash commands loaded`);

export default slashcommands;
export { cooldowns };