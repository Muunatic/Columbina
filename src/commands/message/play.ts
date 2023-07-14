import { Message, Track, player } from '../../client';
import { defaultError } from '../../structures/error';

module.exports = {
    name: 'play',
    async execute(message: Message, args: ReadonlyArray<string>) {
        const query = args.join(' ').toString();
        const queue = player.nodes.create(message.guild, {
            selfDeaf: true,
            leaveOnEnd: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 5000,
            metadata: {
                channel: message.channel
            }
        });

        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');

        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');

        if (message.member.voice.channel.full == true) return message.reply('**Voice channel full!**');

        if (!args[0]) return message.reply('**Berikan judul untuk memulai lagu**');

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            queue.delete();
            return message.reply({ content: defaultError });
        }

        let track: Track;
        if (new RegExp('\\b' + "https://open.spotify.com/track/" + '\\b', 'i').test(query)) {
            track = await player.search(query, {
                searchEngine: "spotifySong",
                ignoreCache: true,
                requestedBy: message.author
            }).then(x => x.tracks[0]);
        } else {
            track = await player.search(query, {
                searchEngine: "youtube",
                ignoreCache: true,
                requestedBy: message.author
            }).then(x => x.tracks[0]);
        }
        if (!track) return message.channel.send({ content: defaultError });

        await queue.node.play(track);

        return message.channel.send({ content: `Menambahkan lagu **${track.title}** di **${message.member.voice.channel.name}...**` });
    }
};
