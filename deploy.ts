import path from 'node:path';
import fs from 'node:fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { token, clientId } from './src/data/config';

const commands: string[] = [];
const commandsPath = path.join(__dirname, './src/commands/interaction');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {

    try {
        console.log("Deploying");
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log("Deployed");
    } catch (error) {
        console.error(error);
    }

})();
