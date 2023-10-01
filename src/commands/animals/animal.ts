import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

const animals = {
  duck: ['duck'],
  goose: ['goose', 'geese'],
  horse: ['horses'],
  kitty: ['kitty', 'cat', 'blurrypicturesofcats'],
  lizard: ['lizards', 'BeardedDragons'],
  meerkat: ['meerkats'],
  monkey: ['monkeys'],
  puppy: ['puppy', 'DOG', 'rarepuppers', 'dogpictures'],
  raccoon: ['Raccoons', 'raccoonfanclub', 'trashpandas'],
  redpanda: ['redpandas'],
  snake: ['snake', 'Sneks'],
};

export const animal: SlashCommand = {
  name: Object.keys(animals),
  description: 'get a picture of a {NAME}!',
  async execute(interaction, client) {
    try { redditFetch(animals[interaction.commandName as keyof typeof animals], interaction, client); }
    catch (err) { error(err, interaction); }
  },
};