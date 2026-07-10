import { CmdOptions, Message } from '../../client';
import { queues } from '../../core/playerManager';

export = {
    name: 'stop',
    async execute(message: Message<true>) {
        const queue = queues.get(message.guild.id);
        if (!queue || !queue.isPlaying()) return message.reply('**No music is currently playing**');
        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**You are not in the same voice channel!**');
        queue.stop();
        await message.reply('**Song has been stopped**');
    }
} as CmdOptions;
