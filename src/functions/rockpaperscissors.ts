import { ButtonBuilder, ButtonStyle, ButtonInteraction, ComponentType, ContainerBuilder, MessageFlags, SectionBuilder, TextDisplayBuilder } from 'discord.js';
import { Command } from '~/types/Objects';
import userOption from '~/options/user';
import { CheckGreen } from '~/misc/emoji';

export default async function createRPS(user: User, opponent: User, interaction: ButtonInteraction | CommandInteraction) {
    if (opponent.id == user.id) {
      error('You played yourself, oh wait, you can\'t.', interaction, true);
      return;
    }

    const emoji = {
      rock: ['🪨', 'Rock', '🪨 Rock'],
      paper: ['📄', 'Paper', '📄 Paper'],
      scissors: ['✂️', 'Scissors', '✂️ Scissors'],
    };

    const TitleSection = new SectionBuilder()
      .addTextDisplayComponents(
        textDisplay => textDisplay
          .setContent('# Rock Paper Scissors'),
        textDisplay => textDisplay
          .setContent(`${interaction.user} challenged ${opponent} to a game of Rock Paper Scissors!`),
        textDisplay => textDisplay
          .setContent('-# Please select your choice by clicking one of the buttons below!'),
      ).setThumbnailAccessory(thumb => thumb
        .setURL(user.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png'),
      );

    const WaitingForSection = new SectionBuilder()
    .addTextDisplayComponents(
      textDisplay => textDisplay
        .setContent('## Waiting for:'),
      textDisplay => textDisplay
        .setContent(`${user}`),
      textDisplay => textDisplay
        .setContent(`${opponent}`),
    ).setThumbnailAccessory(thumb => thumb
      .setURL(opponent.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png'),
    );

    const RPSContainer = new ContainerBuilder()
      .addSectionComponents(TitleSection)
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

    // send message and create collector for buttons
    const rpsmsg = await interaction.reply({ components: [RPSContainer], flags: MessageFlags.IsComponentsV2 });
    // record choices that users made
    const choices: {
      [id: string]: string;
    } = {};
    const filter = (i: ButtonInteraction) => (
      (i.user.id == interaction.user.id || i.user.id == opponent.id) &&
      (i.customId == 'rock' || i.customId == 'paper' || i.customId == 'scissors')
    );
    const collector = rpsmsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 3600000 });

    const againButton = new ButtonBuilder()
    .setCustomId(`rockpaperscissors_again|${xUser.id}|${oUser.id}`)
    .setEmoji({ id: RefreshCw.id })
    .setLabel('Play Again') ll
    .setStyle(ButtonStyle.Secondary);

    collector.on('collect', async btnint => {
      // check if user has already selected an option
      if (choices[btnint.user.id]) {
        btnint.reply({ content: `You've already selected ${emoji[choices[btnint.user.id] as keyof typeof emoji][2]}!`, flags: MessageFlags.Ephemeral });
        return;
      }

      // Save the user's choice and reply with what they selected
      choices[btnint.user.id] = btnint.customId;
      await btnint.reply({ content: `${CheckGreen.getString()} **Selected ${emoji[btnint.customId as keyof typeof emoji][2]}!**`, flags: MessageFlags.Ephemeral });

      // Remove user from waiting for section
      WaitingForSection.spliceTextDisplayComponents(1, 2,
        ...[interaction.user, opponent].filter(user => !choices[user.id])
          .map(user => new TextDisplayBuilder().setContent(`${user}`)),
      );

      // check if both people picked
      if (choices[interaction.user.id] && choices[opponent.id]) {

        // try and figure out if the user won
        let win = true;
        if (choices[opponent.id] == 'rock' && choices[interaction.user.id] == 'scissors') win = false;
        else if (choices[opponent.id] == 'paper' && choices[interaction.user.id] == 'rock') win = false;
        else if (choices[opponent.id] == 'scissors' && choices[interaction.user.id] == 'paper') win = false;

        // Clear waiting for section and buttons
        TitleSection.spliceTextDisplayComponents(2, 1);
        RPSContainer.spliceComponents(1, 4);

        // add section with tie
        if (choices[interaction.user.id] == choices[opponent.id]) {
          RPSContainer.addSectionComponents(section => section
            .addTextDisplayComponents(textDisplay => textDisplay
              .setContent(`## It's a tie!\nBoth users picked ${emoji[choices[opponent.id] as keyof typeof emoji][2]}!`),
            ).setButtonAccessory(againButton),
          );
        }
        // add section with winner
        else {
          const winner = win ? interaction.user : opponent;
          const loser = win ? opponent : interaction.user;
          RPSContainer.addSectionComponents(section => section
            .addTextDisplayComponents(textDisplay => textDisplay
              .setContent(`## ${winner} wins!\n${emoji[choices[winner.id] as keyof typeof emoji][2]} wins over ${emoji[choices[loser.id] as keyof typeof emoji][2]}!`),
            ).setButtonAccessory(againButton),
          );
          TitleSection.setThumbnailAccessory(thumb => thumb
            .setURL(winner.avatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png'),
          );
        }
      }

      // Go on to next turn if no matches
      await interaction.editReply({ components: [RPSContainer], flags: MessageFlags.IsComponentsV2 });
    });
  },
};