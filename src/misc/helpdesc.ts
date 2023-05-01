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
    value: '**1.** Set the support team / staff role in the dashboard by doing /settings and setting the Support Role\n**2.** Set the ticket\'s category channel by doing /settings and setting the Ticket Category\n**3.** Set a log channel by doing /settings and setting the Ticket Log Channel (Optional)\n**4.** Execute /help supportpanel if you want to use a reaction or button to create a ticket\n**5.** Create a ticket to test it out',
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