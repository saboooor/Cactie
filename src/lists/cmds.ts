import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { LoadedCommand } from '~/lists/Objects';

// Set the slash commands collection
const slashcommands = new Collection<string, LoadedCommand>();
const cooldowns = new Collection<string, Collection<string, number>>();

// Register all slash commands
const slashcommandFolders = readdirSync('./src/commands');
await Promise.all(
  slashcommandFolders.map(async folder => {
    const slashcommandFiles = readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('ts'));
    await Promise.all(
      slashcommandFiles.map(async file => {
        const module = await import(`../commands/${folder}/${file}`);

        let slashcommand = module.default || module;
        const name = Object.keys(slashcommand)[0] as keyof typeof slashcommand;
        slashcommand = { name: slashcommand.name ?? name, category: folder, ...slashcommand[name] };

        if (typeof slashcommand.name == 'string') {
          slashcommands.set(slashcommand.name, slashcommand);
        } else {
          await Promise.all(
            slashcommand.name.map((cmdname: string) => {
              slashcommands.set(cmdname, {
                ...slashcommand,
                name: cmdname,
                description: slashcommand.description.replace('{NAME}', cmdname),
              });
            }),
          );
        }
      }),
    );
  }),
);
logger.info(`${slashcommands.size} slash commands loaded`);

export default slashcommands;
export { cooldowns };