import { CmdOptions, Message } from '../../client';
import { queues } from '../../core/playerManager';

export = {
    name: 'pause',
    async execute(message: Message<true>) {
        const queue = queues.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.reply('**No music is currently playing**');

        queue.pause();
        await message.reply('**Playback paused**');
    }
} as CmdOptions<true>;
