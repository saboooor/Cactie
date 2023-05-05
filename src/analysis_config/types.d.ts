/* eslint-disable @typescript-eslint/no-explicit-any */

export class config {
  [key: string]: configValue[]
}

export class configValue {
  expressions?: {
    bool: (dict_of_vars: {
      plugins: any,
      server_properties: any,
      bukkit: any,
      spigot: any,
      paper: any,
      pufferfish: any,
      purpur: any
    }) => boolean;
    vars: string[];
  }[];
  prefix: string;
  value: string;
  buttons?: {
    text: string;
    url: string;
  }[];
}

export class servers {
  servers: {
    name: string;
    prefix: string;
    value: string;
    buttons: {
      text: string;
      url: string;
    }[];
  }[];
}

export class plugins {
  [key: string]: {
    prefix: string;
    value: string;
    buttons?: {
      text: string;
      url: string;
    }[];
  }
}