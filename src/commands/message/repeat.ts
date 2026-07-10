import { CmdOptions, Message } from '../../client';
import { queues } from '../../core/playerManager';
import { RepeatMode } from '../../utils/interface';

export = {
    name: 'repeat',
    aliases: ['loop'],
    async execute(message: Message<true>, args: ReadonlyArray<string>) {
        const queue = queues.get(message.guild.id);
        if (!queue) return message.reply('**No active queue in this server**');

        const mode = args[0]?.toLowerCase();
        const modeMap: Record<string, RepeatMode> = {
            off: RepeatMode.Off,
            track: RepeatMode.Track,
            song: RepeatMode.Track,
            queue: RepeatMode.Queue
        };

        if (!mode || !(mode in modeMap)) {
            return message.reply('**Usage: `repeat <off|track|queue>`**');
        }

        queue.setRepeatMode(modeMap[mode]);
        await message.reply(`**Repeat mode set to: ${mode}**`);
    }
} as CmdOptions;
