import { player, Message, EmbedBuilder, SearchResult } from '../../client';
import { DefaultError } from '../../structures/error';

module.exports = {
    name: 'search',
    async execute(message: Message, args: Array<string>) {
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
        if (!args[0]) return message.reply('**Berikan judul untuk mencari lagu**');

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            queue.delete();
            return await message.reply({ content: DefaultError });
        }

        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');

        let track: SearchResult;
        if (new RegExp('\\b' + "https://open.spotify.com/track/" + '\\b', 'i').test(query)) {
            track = await player.search(query, {
                searchEngine: "spotifySearch",
                ignoreCache: true,
                requestedBy: message.author
            });
        } else {
            track = await player.search(query, {
                searchEngine: "youtube",
                ignoreCache: true,
                requestedBy: message.author
            });
        }
        if (!track) return await message.channel.send({ content: DefaultError });

        const embed = new EmbedBuilder()
        .setColor('#89e0dc')
        .setAuthor({name: 'Pilih angka untuk memulai lagu, ketik cancel untuk membatalkan', iconURL: message.client.user.avatarURL({extension: 'png', forceStatic: false, size : 1024})})
        .setDescription('**1. ' + track.tracks[0].title + '\n' + '2. ' + track.tracks[1].title + '\n' + '3. ' + track.tracks[2].title + '\n' + '4. ' + track.tracks[3].title + '\n'  + '5. ' + track.tracks[4].title + '\n**')
        .setFooter({text: `Direquest oleh ${message.member.nickname || message.author.username}`, iconURL: message.author.avatarURL({extension: 'png', forceStatic: false, size : 1024})})
        .setTimestamp();

        message.reply({embeds: [embed]});
        const collector = message.channel.createMessageCollector({
            filter: (user) => user.member.id === message.author.id,
            time: 60000
        });

        collector.on('collect', async (msg: Message) => {
            const value = parseInt(msg.content);
            if (msg.content.toLowerCase() === 'cancel') return msg.reply('**Query dibatalkan**') && collector.stop();
            if (!value || value < 0 || value > 5) {
                msg.reply(DefaultError);
                return;
            } else {
                await message.channel.send({ content: `Menambahkan lagu **${track.tracks[value - 1].title}** di **${message.member.voice.channel.name}...**` });
                collector.stop();
                queue.addTrack(track.tracks[value - 1]);
                if (!queue.node.isPlaying()) await queue.node.play();
            }
        });
    }
};
