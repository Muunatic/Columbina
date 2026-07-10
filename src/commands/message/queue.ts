import { CmdOptions, Message } from '../../client';
import { queues } from '../../core/playerManager';

export = {
    name: 'queue',
    async execute(message: Message<true>) {
        const queue = queues.get(message.guild.id);
        if (!queue || !queue.isPlaying() || !queue.currentTrack) return message.reply('**No music is currently playing**');

        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');
        if (message.guild.members.me?.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id)
            return message.reply('**You are not in the same voice channel!**');

        const current = queue.currentTrack;
        const header = `**Music Queue**\nNow Playing: **${current.title}** | **${current.author ?? 'Unknown'}**`;

        if (queue.tracks.length === 0) {
            return message.reply(header);
        }

        const upcoming = queue.tracks
            .slice(0, 5)
            .map((track, i) => `**#${i + 1}** - **${track.title}** | **${track.author ?? 'Unknown'}** (requested by: **${track.requestedBy.username}**)`)
            .join('\n');

        const remaining = queue.tracks.length > 5
            ? `and **${queue.tracks.length - 5}** more songs...`
            : `Playlist contains **${queue.tracks.length}** songs...`;

        await message.reply(`${header}\n\n${upcoming}\n\n${remaining}`);
    }
} as CmdOptions;
