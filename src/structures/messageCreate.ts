console.info('Loading messageCreate.ts');
import { client } from '../client';
import { prefix } from '../data/config';
import { DefaultError } from '../structures/error';

client.on('messageCreate', async (message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (!message.guild) return;

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        await message.reply(DefaultError);
    }

});