import { CmdOptions, Message } from '../../client';
import { queues } from '../../core/playerManager';

export = {
    name: 'volume',
    async execute(message: Message<true>, args: ReadonlyArray<string>) {
        const queue = queues.get(message.guild.id);
        if (!queue) return message.reply('**No active queue in this server**');
        if (!args[0]) return message.reply(`**Current volume: ${queue.getVolume()}%**`);
        const vol = Number(args[0]);
        if (isNaN(vol)) return message.reply('**Provide a valid number (0-200)**');
        queue.setVolume(vol);
        await message.reply(`**Volume set to ${queue.getVolume()}%**`);
    }
} as CmdOptions<true>;
