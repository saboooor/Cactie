const fs = require('fs');
module.exports = (prefix, Embed) => {
	const nsfwCommands = fs.readdirSync('./commands/nsfw').filter(file => file.endsWith('.js'));
	Embed.setDescription(`
**NSFW COMMANDS:**
*All NSFW commands are based on Reddit's API. NOT cherry picked.*
${nsfwCommands.join(', ').replace(/.js/g, '')}
`);
};