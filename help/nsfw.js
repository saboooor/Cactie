const fs = require('fs');
module.exports = (prefix, Embed) => {
	const slashcommandFiles = fs.readdirSync('./commands/user/nsfw').filter(file => file.endsWith('.js'));
	Embed.setDescription(`
**NSFW COMMANDS:**
*All NSFW commands are based on Reddit's API. NOT cherry picked.*
${slashcommandFiles.join(', ').replace(/.js/g, '')}
`);
};