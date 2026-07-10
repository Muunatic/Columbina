import { CmdOptions, Message } from '../../client';
import { queues } from '../../core/playerManager';

export = {
    name: 'resume',
    async execute(message: Message<true>) {
        const queue = queues.get(message.guild.id);
        if (!queue || !queue.isPaused()) return message.reply('**Music is not paused**');

        queue.resume();
        await message.reply('**Playback resumed**');
    }
} as CmdOptions<true>;
