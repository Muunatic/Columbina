import { prefix } from '../../data/config';
import { player } from '../../client';

module.exports = {
    name: 'play',
    async execute(message) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const query = args.slice(1).join(' ');
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

        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            queue.destroy();
            return await message.reply({ content: 'undefined', ephemeral: true });
        }

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');

        const track = await player.search(query, {
            requestedBy: message.user
        }).then(x => x.tracks[0]);
        if (!track) return await message.channel.send({ content: 'null' });

        queue.play(track);

        return await message.channel.send({ content: `Menambahkan lagu **${track.title}** di **${message.member.voice.channel.name}...**` });
    },
};