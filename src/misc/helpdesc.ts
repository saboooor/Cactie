declare interface HelpDesc {
    name: string;
    description: string;
    field?: {
        name: string;
        value: string;
    };
    footer?: string;
}

export const admin: HelpDesc = {
  name: 'Admin',
  description: 'These commands require specific permissions',
};

export const fun: HelpDesc = {
  name: 'Fun',
  description: 'These commands are made just for fun',
};

export const animals: HelpDesc = {
  name: 'Animals',
  description: 'These commands show cute animals',
};

export const tickets: HelpDesc = {
  name: 'Tickets',
  description: 'These commands are related to the bot\'s tickets system',
  field: {
    name: '**How to create support tickets:**',
    value: '**1.** Set ticket related settings in the dashboard by going to https://cactie.luminescent.dev\n**2.** Execute /help supportpanel if you want to create an embed for users to easily create tickets\n**3.** Create a ticket to test it out',
  },
};

export const utilities: HelpDesc = {
  name: 'Utilities',
  description: 'These commands are useful for some situations',
};

export const actions: HelpDesc = {
  name: 'Actions',
  description: 'These commands let you do stuff to people',
  footer: '*All these commands can be suffixed with a user @ to do the action on them.*',
};

export const supportpanel: HelpDesc = {
  name: 'Support Panel (Admin only)',
  description: 'This command sends a message that has a button to open tickets',
};