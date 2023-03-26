import { Client } from "discord.js";
import { readdirSync } from 'fs';

export default (client: Client) => {
	const eventFolders = readdirSync('./src/events/');
	let jsFiles = [];
	for (const event of eventFolders) {
		jsFiles = readdirSync(`./src/events/${event}`).filter(subfile => subfile.endsWith('.js') || subfile.endsWith('.ts'));
		for (const file of jsFiles) {
			const js = require(`../events/${event}/${file}`).default ?? require(`../events/${event}/${file}`);
			client.on(event, js.bind(null, client));
			delete require.cache[require.resolve(`../events/${event}/${file}`)];
		}
	}
	logger.info(`${jsFiles.length} event listeners loaded`);
};