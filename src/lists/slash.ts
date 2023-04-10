import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { SlashCommand } from 'types/Objects';

// Set the slash commands collection
const slashcommands = new Collection<string, SlashCommand>();

// Register all slash commands
const slashcommandFolders = readdirSync('./src/commands');
for (const folder of slashcommandFolders) {
  const slashcommandFiles = readdirSync(`./src/commands/${folder}`).filter(file => (file.endsWith('.js') || file.endsWith('ts')) && folder != 'animals' && folder != 'private');
  for (const file of slashcommandFiles) {
    let slashcommand = require(`../commands/${folder}/${file}`);
    const name = Object.keys(slashcommand)[0] as keyof typeof slashcommand;

    if (!slashcommand.name) slashcommand = { name, category: folder, ...slashcommand[name] };
    slashcommands.set(slashcommand.name, slashcommand);
  }
}
logger.info(`${slashcommands.size} slash commands loaded`);

export default slashcommands;