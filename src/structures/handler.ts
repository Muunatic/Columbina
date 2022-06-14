console.info('Loading handler.ts');
import path = require('node:path');
import fs = require('fs');
import { client } from '../client';
import { Collection } from 'discord.js';

declare module "discord.js" {
  export interface Client {
    commands: Collection<unknown, any>
  }
}

client.commands = new Collection();
const interactionPath = path.join(__dirname, '../commands/interaction');
const commandInteraction = fs.readdirSync(interactionPath).filter(file => file.endsWith('.js'));

for (const file of commandInteraction) {
  const filePath = path.join(interactionPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

const commandPath = path.join(__dirname, '../commands/message');
const commandMessage = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandMessage) {
  const filePath = path.join(commandPath, file);
  const command = require(filePath);
  client.commands.set(command.name, command);
}