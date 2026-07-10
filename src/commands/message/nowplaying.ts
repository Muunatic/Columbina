import { CmdOptions, Message } from '../../client';
import { PlayerManager, queues } from '../../core/playerManager';
import { resolveTrack } from '../../core/ytdl';
import { defaultError } from '../../structures/error';

export = {
    name: 'play',
    async execute(message: Message<true>, args: ReadonlyArray<string>) {
        const query = args.join(' ');
        if (!query) return message.reply('**Provide a title or URL to start playing a song**');

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('**You are not in a voice channel!**');

        if (message.guild.members.me?.voice.channel && voiceChannel.id !== message.guild.members.me.voice.channel.id)
            return message.reply('**You are not in the same voice channel!**');

        if (voiceChannel.full) return message.reply('**Voice channel is full!**');

        let queue = queues.get(message.guild.id);
        if (!queue) {
            queue = new PlayerManager(message.guild, voiceChannel, message.channel);
            try {
                await queue.connect();
            } catch {
                queue.destroy();
                return message.reply({ content: defaultError });
            }
            queues.set(message.guild.id, queue);
        }

        const track = await resolveTrack(query, message.author);
        if (!track) return message.channel.send({ content: defaultError });

        await queue.addTrack(track);

        return message.channel.send({
            content: `Added song **${track.title}** to **${voiceChannel.name}...**`
        });
    }
} as CmdOptions;
