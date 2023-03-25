import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import type { TextChannel, Client, Message } from 'discord.js';

export default (client: Client) => {
	// Create a function for error messaging
	global.error = function error(err: any, message: Message, userError: boolean = false) {
		if (`${err}`.includes('Received one or more errors')) console.log(err);
		logger.error(err);
		const errEmbed = new EmbedBuilder()
			.setColor(0xE74C3C)
			.setTitle('An error has occured!')
			.setURL(`https://panel.netherdepths.com/server/${message.client.user.username == 'Cactie' ? '41769d86' : '3f2661e1'}/files/edit#/logs/${logDate}.log`)
			.setDescription(`\`\`\`\n${err}\n\`\`\``);
		const components: ActionRowBuilder<ButtonBuilder>[] = [];
		if (!userError) {
			errEmbed.setFooter({ text: 'This was most likely an error on our end. Please report this at the Cactie Support Discord Server.' });
			components.push(
				new ActionRowBuilder<ButtonBuilder>()
					.addComponents([
						new ButtonBuilder()
							.setURL('https://luminescent.dev/discord')
							.setLabel('Support Server')
							.setStyle(ButtonStyle.Link),
					])
			);
			const channel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('830013224753561630')! as TextChannel;
			channel.send({ embeds: [errEmbed] });
		}
		message.reply({ embeds: [errEmbed], components }).catch(err => {
			logger.warn(err);
			message.channel.send({ embeds: [errEmbed], components }).catch(err => logger.warn(err));
		});
	};
	client.rest.on('rateLimited', (info) => logger.warn(`Encountered ${info.method} rate limit!`));
	process.on('unhandledRejection', (reason: any) => {
		if (reason.rawError && (reason.rawError.message == 'Unknown Message' || reason.rawError.message == 'Unknown Interaction' || reason.rawError.message == 'Missing Access' || reason.rawError.message == 'Missing Permissions')) {
			logger.error(JSON.stringify(reason.requestBody));
		}
	});
	logger.info('Error Handler Loaded');
};