import fs = require('fs');
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { token, clientId } from './src/data/config';

const commands = []

.map(command => command.toJSON());

const commandFiles = fs.readdirSync('./src/commands/interaction').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/commands/interaction/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {

	try {
		console.log('Refreshing...');
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		console.log('Deployed');
	} catch (error) {
		console.error(error);
	}

})();