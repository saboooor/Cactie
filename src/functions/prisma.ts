import { PrismaClient, settings } from '@prisma/client';

const prisma = new PrismaClient();
logger.info('Prisma client initialized');

export default prisma;

export async function getGuildConfig(guildId: string) {
  const srvconfigUnparsed = await prisma.settings.upsert({
    where: { guildId },
    create: { guildId },
    update: {},
  });

  const srvconfig = {
    ...srvconfigUnparsed,
    joinmessage: JSON.parse(srvconfigUnparsed.joinmessage),
    leavemessage: JSON.parse(srvconfigUnparsed.leavemessage),
    tickets: JSON.parse(srvconfigUnparsed.tickets),
    reactions: JSON.parse(srvconfigUnparsed.reactions),
    auditlogs: JSON.parse(srvconfigUnparsed.auditlogs),
  };

  return srvconfig;
}

export type guildConfig = settings & {
  joinmessage: {
    message: string;
    channel: string;
  };
  leavemessage: {
    message: string;
    channel: string;
  }
  tickets: {
    enabled: boolean;
    type: 'buttons' | 'reactions';
    logchannel: 'false' | string;
    category: 'false' | string;
    role: 'false' | string;
    mention: 'everyone' | 'here' | 'false' | string;
    count: number | 'false';
  }
  reactions: {
    regex: string;
    emojis: string[];
  }[]
  auditlogs: {
    channel: 'false' | string;
    logs: {
      [log: string]: {
        channel: 'false' | string;
      }
    }
  };
}