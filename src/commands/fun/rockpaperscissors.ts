import { ButtonBuilder, ButtonStyle, ButtonInteraction, ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, TextDisplayBuilder } from 'discord.js';
import { Command } from '~/types/Objects';
import userOption from '~/options/user';
import { CheckGreen } from '~/misc/emoji';

export const rockpaperscissors: Command<'cached'> = {
  description: 'Play Rock Paper Scissors',
  cooldown: 10,
  options: userOption,
  async execute(interaction) {
    const opponent = interaction.options.getMember('user')?.user;
    if (!opponent) {
      error('Invalid member! Are they in this server?', interaction, true);
      return;
    }
    if (opponent.id == interaction.user.id) {
      error('You played yourself, oh wait, you can\'t.', interaction, true);
      return;
    }
    if (opponent.bot) {
      error('Bots aren\'t fun to play with, yet. ;)', interaction, true);
      return;
    }

    const emoji = {
      rock: ['🪨', 'Rock', '🪨 Rock'],
      paper: ['📄', 'Paper', '📄 Paper'],
      scissors: ['✂️', 'Scissors', '✂️ Scissors'],
    };

    const WaitingForSection = new SectionBuilder().addTextDisplayComponents(
      textDisplay => textDisplay
        .setContent('## Waiting for:'),
      textDisplay => textDisplay
        .setContent(`${interaction.user}`),
      textDisplay => textDisplay
        .setContent(`${opponent}`),
    )
      .setThumbnailAccessory(thumb => thumb
        .setURL(opponent.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png'),
      );
    const RSPContainer = new ContainerBuilder()
      .addSectionComponents(section => section
        .addTextDisplayComponents(
          textDisplay => textDisplay
            .setContent('# Rock Paper Scissors'),
          textDisplay => textDisplay
            .setContent(`${interaction.user} challenged ${opponent} to a game of Rock Paper Scissors!`),
          textDisplay => textDisplay
            .setContent('Please select your choice by clicking one of the buttons below!'),
        )
        .setThumbnailAccessory(thumb => thumb
          .setURL(interaction.user.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png'),
        ),
      )
      .addSeparatorComponents(separator => separator)
      .addActionRowComponents(actionRow => actionRow
        .addComponents(
          Object.keys(emoji).map(key => new ButtonBuilder()
            .setCustomId(key)
            .setEmoji({ name: emoji[key as keyof typeof emoji][0] })
            .setLabel(emoji[key as keyof typeof emoji][1]!)
            .setStyle(ButtonStyle.Secondary),
          ),
        ),
      )
      .addSeparatorComponents(separator => separator)
      .addSectionComponents(WaitingForSection);

    const rpsmsg = await interaction.reply({ components: [RSPContainer], flags: MessageFlags.IsComponentsV2 });

    const filter = (i: ButtonInteraction) => (
      (i.user.id == interaction.user.id || i.user.id == opponent.id) &&
      (i.customId == 'rock' || i.customId == 'paper' || i.customId == 'scissors')
    );
    const collector = rpsmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });

    const choices: {
      [id: string]: string;
    } = {};
    collector.on('collect', async btnint => {
      // check if user has already selected an option
      if (choices[btnint.user.id]) {
        btnint.reply({ content: `You've already selected ${emoji[choices[btnint.user.id] as keyof typeof emoji][2]}!`, flags: MessageFlags.Ephemeral });
        return;
      }

      // Save the user's choice and reply with what they selected
      choices[btnint.user.id] = btnint.customId;
      await btnint.reply({ content: `${CheckGreen.getString()} **Selected ${emoji[btnint.customId as keyof typeof emoji][2]}!**`, flags: MessageFlags.Ephemeral });

      WaitingForSection.spliceTextDisplayComponents(1, 2,
        ...[interaction.user, opponent].filter(user => !choices[user.id])
          .map(user => new TextDisplayBuilder().setContent(`${user}`)),
      );

      if (choices[interaction.user.id] && choices[opponent.id]) {

        let win = true;

        if (choices[opponent.id] == 'rock' && choices[interaction.user.id] == 'scissors') win = false;
        else if (choices[opponent.id] == 'paper' && choices[interaction.user.id] == 'rock') win = false;
        else if (choices[opponent.id] == 'scissors' && choices[interaction.user.id] == 'paper') win = false;

        if (choices[interaction.user.id] == choices[opponent.id]) {
          WaitingForSection.addTextDisplayComponents(textDisplay =>
            textDisplay.setContent(`## It's a tie!\nBoth users picked ${emoji[choices[opponent.id] as keyof typeof emoji][2]}!`),
          );
          await btnint.editReply({ components: [WaitingForSection], flags: MessageFlags.IsComponentsV2 });
          return;
        }
        else {
          RSPContainer.spliceComponents(4, 1);
        }

        const winner = win ? interaction.user : opponent;
        const loser = win ? opponent : interaction.user;
        WaitingForSection.addTextDisplayComponents(textDisplay =>
          textDisplay.setContent(`**${winner} wins!**\n\n${emoji[choices[winner.id] as keyof typeof emoji][2]} wins over ${emoji[choices[loser.id] as keyof typeof emoji][2]}!`),
        );

        await btnint.editReply({ components: [WaitingForSection], flags: MessageFlags.IsComponentsV2 });
      }

      // Go on to next turn if no matches
      interaction.editReply({ components: [WaitingForSection], flags: MessageFlags.IsComponentsV2 });
    });
  },
};