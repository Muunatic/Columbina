console.info('Loading messageCreate.ts');
import { client, Message } from '../client';
import { prefix } from '../data/config';
import { DefaultError } from '../structures/error';

client.on('messageCreate', async (message: Message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.find(a => a.aliases && a.aliases.includes(command));

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (!message.guild) return;
    
    if (!cmd) return;
    
    try {
        cmd.execute(message, args);
    } catch (error) {
        console.error(error);
        await message.reply(DefaultError);
    }

});
