import { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ComponentType, ButtonInteraction, CommandInteraction } from 'discord.js';
import { refresh } from '~/misc/emoji.json';
import { SlashCommand } from '~/types/Objects';
import pong from '~/misc/pong.json';

export const ping: SlashCommand = {
  description: 'Pong!',
  cooldown: 10,
  async execute(message, args, client) {
    try {
      // Create embed with ping information and add ping again button
      const PingEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(pong[0])
        .setDescription(`**Message Latency** ${Date.now() - message.createdTimestamp}ms\n**API Latency** ${client.ws.ping}ms`);
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setCustomId('ping_again')
            .setEmoji({ id: refresh })
            .setLabel('Refresh')
            .setStyle(ButtonStyle.Secondary),
        ]);

      // reply with embed
      const pingmsg = await message.reply({ embeds: [PingEmbed], components: [row] });

      // create collector for ping again button
      const filter = (i: ButtonInteraction) => i.customId == 'ping_again';
      const collector = pingmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 30000 });
      collector.on('collect', async interaction => {
        // Check if the button is one of the settings buttons
        await interaction.deferUpdate();

        // Set the embed description with new ping stuff
        PingEmbed.setDescription(`**Message Latency** ${Date.now() - interaction.createdTimestamp}ms\n**API Latency** ${client.ws.ping}ms`);

        // Get next string (if last index, go to index 0)
        const newIndex = pong.indexOf(PingEmbed.toJSON().title!) == pong.length - 1 ? 0 : pong.indexOf(PingEmbed.toJSON().title!) + 1;

        // Set title and update message
        PingEmbed.setTitle(pong[newIndex]);
        await interaction.editReply({ embeds: [PingEmbed] });
      });

      // When the collector stops, remove all buttons from it
      collector.on('end', () => {
        if (message instanceof CommandInteraction) message.editReply({ components: [] }).catch(err => logger.warn(err));
        else pingmsg.edit({ components: [] }).catch(err => logger.warn(err));
      });
    }
    catch (err) { error(err, message); }
  },
};