import { Client } from 'discord.js';

export default async (client: Client) => {
  const cactieguild = client.guilds.cache.get('811354612547190794');
  if (!cactieguild) return;
  const role = cactieguild.roles.cache.find(r => r.name == `${client.user!.username} User`);
  if (!role) return;
  const owners: string[] = [];
  client.guilds.cache.forEach(async guild => {
    if (!owners.includes(guild.ownerId)) owners.push(guild.ownerId);
    const member = cactieguild.members.cache.get(guild.ownerId);
    if (!member) return;
    if (member.roles.cache.has(role.id)) return;
    member.roles.add(role.id);
    logger.info(`Added cactie user role to ${member.user.tag}`);
  });
  role.members.forEach(async member => {
    if (owners.includes(member.id)) return;
    member.roles.remove(role.id);
    logger.info(`Removed cactie user role from ${member.user.tag}`);
  });

  const commrole = cactieguild.roles.cache.get('971827078775328858');
  if (!commrole) return;
  cactieguild.members.cache.forEach(member => {
    if (member.roles.cache.has(commrole.id)) return;
    member.roles.add(commrole.id);
  });
};