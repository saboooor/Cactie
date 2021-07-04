// Prerequisite:
// Set DiscordChatChannelListCommandExpiration in the DiscordSRV config.yml to 0 to prevent 'Unknown Message' from showing in the console cuz of the discordsrv bot trying to delete a message that got deleted already
// We'll be using line 102 instead
//
// How to add a new rank (In this case the new rank would be Warden)
// 1. add const warden = players.filter(word => word.startsWith('[Warden]')).sort().join(', ').replace(/\[Warden\] /g, '').replace(/_/g, '\\_'); in the list of the constants
// 2. add '[Warden]' anywhere in the list of ranks in the other const
// 3. add if (warden) Embed.addField('**Warden**', warden); in the list of if statements (ORDER MATTERS)
//
// Code:
const Discord = require('discord.js');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'list',
	async execute(message) {
		if (message.author.id !== '743741294190395402' && message.author.id !== '661797951223627787') return;
		let list = await message.channel.messages.fetch({ limit: 4 });
		list = await list.find(msg => msg.content.toLowerCase() == 'list');
		message.delete();
		const count = message.content.split(/\n+/)[0];
		const players = message.content.replace(`${count}\n\`\`\`\n`, '').replace('\n```', '').split(/, /);
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle(count);
		if (message.guild.id == '711661870926397601') {
			const owner = players.filter(word => word.startsWith('[Owner]')).sort().join(', ').replace(/\[Owner\] /g, '').replace(/_/g, '\\_');
			const headadmin = players.filter(word => word.startsWith('[Head Admin]')).sort().join(', ').replace(/\[Head Admin\] /g, '').replace(/_/g, '\\_');
			const admin = players.filter(word => word.startsWith('[Admin]')).sort().join(', ').replace(/\[Admin\] /g, '').replace(/_/g, '\\_');
			const mod = players.filter(word => word.startsWith('[Mod]')).sort().join(', ').replace(/\[Mod\] /g, '').replace(/_/g, '\\_');
			const helper = players.filter(word => word.startsWith('[Helper]')).sort().join(', ').replace(/\[Helper\] /g, '').replace(/_/g, '\\_');
			const trainee = players.filter(word => word.startsWith('[Trainee]')).sort().join(', ').replace(/\[Trainee\] /g, '').replace(/_/g, '\\_');
			const vip = players.filter(word => word.startsWith('[VIP]')).sort().join(', ').replace(/\[VIP\] /g, '').replace(/_/g, '\\_');
			const dev = players.filter(word => word.startsWith('[Dev]')).sort().join(', ').replace(/\[Dev\] /g, '').replace(/_/g, '\\_');
			const retired = players.filter(word => word.startsWith('[Retired]')).sort().join(', ').replace(/\[Retired\] /g, '').replace(/_/g, '\\_');
			const tacosbuilder = players.filter(word => word.startsWith('[Taco\'s Builder]')).sort().join(', ').replace(/\[Taco's Builder\] /g, '').replace(/_/g, '\\_');
			const taco = players.filter(word => word.startsWith('[Taco]')).sort().join(', ').replace(/\[Taco\] /g, '').replace(/_/g, '\\_');
			const cheese = players.filter(word => word.startsWith('[Cheese]')).sort().join(', ').replace(/\[Cheese\] /g, '').replace(/_/g, '\\_');
			const guacamole = players.filter(word => word.startsWith('[Guacamole]')).sort().join(', ').replace(/\[Guacamole\] /g, '').replace(/_/g, '\\_');
			const beans = players.filter(word => word.startsWith('[Beans]')).sort().join(', ').replace(/\[Beans\] /g, '').replace(/_/g, '\\_');
			const onion = players.filter(word => word.startsWith('[Onion]')).sort().join(', ').replace(/\[Onion\] /g, '').replace(/_/g, '\\_');
			const tomato = players.filter(word => word.startsWith('[Tomato]')).sort().join(', ').replace(/\[Tomato\] /g, '').replace(/_/g, '\\_');
			const lettuce = players.filter(word => word.startsWith('[Lettuce')).sort().join(', ').replace(/\[Lettuce\] /g, '').replace(/_/g, '\\_');
			const beef = players.filter(word => word.startsWith('[Beef]')).sort().join(', ').replace(/\[Beef\] /g, '').replace(/_/g, '\\_');
			const other = players.filter(word => !['[Owner]', '[Head Admin]', '[Admin]', '[Mod]', '[Helper]', '[Trainee]', '[VIP]', '[Dev]', '[Retired]', '[Taco\'s Builder]', '[Taco]', '[Cheese]', '[Guacamole]', '[Beans]', '[Onion]', '[Tomato]', '[Lettuce]', '[Beef]'].some(a => word.startsWith(a))).sort().join(', ');
			if (owner) Embed.addField('**Owner**', owner);
			if (headadmin) Embed.addField('**Head Admin**', headadmin);
			if (admin) Embed.addField('**Admin**', admin);
			if (mod) Embed.addField('**Mod**', mod);
			if (helper) Embed.addField('**Helper**', helper);
			if (trainee) Embed.addField('**Trainee**', trainee);
			if (vip) Embed.addField('**VIP**', vip);
			if (dev) Embed.addField('**Dev**', dev);
			if (retired) Embed.addField('**Retired**', retired);
			if (tacosbuilder) Embed.addField('**Taco\'s Builder**', tacosbuilder);
			if (taco) Embed.addField('**Taco**', taco);
			if (cheese) Embed.addField('**Cheese**', cheese);
			if (guacamole) Embed.addField('**Guacamole**', guacamole);
			if (beans) Embed.addField('**Beans**', beans);
			if (onion) Embed.addField('**Onion**', onion);
			if (tomato) Embed.addField('**Tomato**', tomato);
			if (lettuce) Embed.addField('**Lettuce**', lettuce);
			if (beef) Embed.addField('**Beef**', beef);
			if (other) Embed.addField('**Other**', other);
		}
		else if (message.guild.id == '661736128373719141') {
			const owner = players.filter(word => word.startsWith('Founder')).sort().join(', ').replace(/Founder • /g, '').replace(/_/g, '\\_');
			const admin = players.filter(word => word.startsWith('Administrator')).sort().join(', ').replace(/Administrator • /g, '').replace(/_/g, '\\_');
			const mod = players.filter(word => word.startsWith('Moderator')).sort().join(', ').replace(/Moderator • /g, '').replace(/_/g, '\\_');
			const helper = players.filter(word => word.startsWith('Helper')).sort().join(', ').replace(/Helper • /g, '').replace(/_/g, '\\_');
			const trainee = players.filter(word => word.startsWith('Trainee')).sort().join(', ').replace(/Trainee • /g, '').replace(/_/g, '\\_');
			const mvp = players.filter(word => word.startsWith('MVP')).sort().join(', ').replace(/MVP • /g, '').replace(/_/g, '\\_');
			const vip = players.filter(word => word.startsWith('VIP')).sort().join(', ').replace(/VIP • /g, '').replace(/_/g, '\\_');
			const glowsquid = players.filter(word => word.startsWith('Glow Squid')).sort().join(', ').replace(/Glow Squid • /g, '').replace(/_/g, '\\_');
			const warden = players.filter(word => word.startsWith('Warden')).sort().join(', ').replace(/Warden • /g, '').replace(/_/g, '\\_');
			const axolotl = players.filter(word => word.startsWith('Axolotl')).sort().join(', ').replace(/Axolotl • /g, '').replace(/_/g, '\\_');
			const hoglin = players.filter(word => word.startsWith('Hoglin')).sort().join(', ').replace(/Hoglin • /g, '').replace(/_/g, '\\_');
			const strider = players.filter(word => word.startsWith('Strider')).sort().join(', ').replace(/Strider • /g, '').replace(/_/g, '\\_');
			const blaze = players.filter(word => word.startsWith('Blaze')).sort().join(', ').replace(/Blaze • /g, '').replace(/_/g, '\\_');
			const enderman = players.filter(word => word.startsWith('Enderman')).sort().join(', ').replace(/Enderman • /g, '').replace(/_/g, '\\_');
			const skeleton = players.filter(word => word.startsWith('Skeleton')).sort().join(', ').replace(/Skeleton • /g, '').replace(/_/g, '\\_');
			const player = players.filter(word => word.startsWith('Player')).sort().join(', ').replace(/Player • /g, '').replace(/_/g, '\\_');
			const other = players.filter(word => !['Founder', 'Administrator', 'Moderator', 'Helper', 'Trainee', 'MVP', 'VIP', 'Glow Squid', 'Warden', 'Axolotl', 'Hoglin', 'Strider', 'Blaze', 'Enderman', 'Skeleton', 'Player'].some(a => word.startsWith(a))).sort().join(', ');
			if (owner) Embed.addField('**Founder**', owner);
			if (admin) Embed.addField('**Administrator**', admin);
			if (mod) Embed.addField('**Moderator**', mod);
			if (helper) Embed.addField('**Helper**', helper);
			if (trainee) Embed.addField('**Trainee**', trainee);
			if (mvp) Embed.addField('**MVP**', mvp);
			if (vip) Embed.addField('**VIP**', vip);
			if (glowsquid) Embed.addField('**Glow Squid**', glowsquid);
			if (warden) Embed.addField('**Warden**', warden);
			if (axolotl) Embed.addField('**Axolotl**', axolotl);
			if (hoglin) Embed.addField('**Hoglin**', hoglin);
			if (strider) Embed.addField('**Strider**', strider);
			if (blaze) Embed.addField('**Blaze**', blaze);
			if (enderman) Embed.addField('**Enderman**', enderman);
			if (skeleton) Embed.addField('**Skeleton**', skeleton);
			if (player) Embed.addField('**Player**', player);
			if (other) Embed.addField('**Other**', other);
		}
		const msg = await message.channel.send({ embeds: [Embed] });
		await sleep(8000);
		msg.delete();
		list.delete();
	},
};