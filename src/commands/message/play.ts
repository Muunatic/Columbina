import { player } from '../../client';
import { DefaultError } from '../../structures/error';

module.exports = {
    name: 'play',
    async execute(message, args) {
        const query = args.join(' ');
        const queue = await player.createQueue(message.guild, {
            autoSelfDeaf: true,
            leaveOnEnd: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 60000,
            ytdlOptions: {
                quality: "highestaudio",
                filter: "audioonly",
                highWaterMark: 1 << 25,
                dlChunkSize: 0,
            },
            metadata: {
                channel: message.channel
            }
        });

        if (!args[0]) return message.reply('**Berikan judul untuk memulai lagu**');

        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            queue.destroy();
            return await message.reply({ content: DefaultError, ephemeral: true });
        }

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');

        const track = await player.search(query, {
            requestedBy: message.author
        }).then(x => x.tracks[0]);
        if (!track) return await message.channel.send({ content: DefaultError });

        queue.play(track);

        return await message.channel.send({ content: `Menambahkan lagu **${track.title}** di **${message.member.voice.channel.name}...**` });
    },
};