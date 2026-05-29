declare interface HelpDesc {
    name: string;
    description: string;
}

export const admin: HelpDesc = {
  name: 'Admin',
  description: 'These commands require specific permissions',
};

export const fun: HelpDesc = {
  name: 'Fun',
  description: 'These commands are made just for fun',
};

export const utilities: HelpDesc = {
  name: 'Utilities',
  description: 'These commands are useful for some situations',
};

export const actions: HelpDesc = {
  name: 'Actions',
  description: 'These commands let you do stuff to people',
};

export const supportpanel: HelpDesc = {
  name: 'Support Panel (Admin only)',
  description: 'This command sends a message that has a button to open tickets',
};