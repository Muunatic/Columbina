console.info('Loading handler.ts');
import * as fs from 'fs';
import { client } from '../client';
import { Collection } from 'discord.js';

declare module "discord.js" {
  export interface Client {
    commands: Collection<unknown, any>
  }
}

client.commands = new Collection();
const commandInteraction = fs.readdirSync('./dist/src/commands/interaction').filter(file => file.endsWith('.js'));

for (const file of commandInteraction) {
  const command = require(`../commands/interaction/${file}`);
  client.commands.set(command.data.name, command);
}

const commandMessage = fs.readdirSync('./dist/src/commands/message').filter(file => file.endsWith('.js'));

for (const file of commandMessage) {
  const command = require(`../commands/message/${file}`);
  client.commands.set(command.name, command);
}