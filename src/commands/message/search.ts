import { player, Message, MessageEmbed } from '../../client';
import { DefaultError } from '../../structures/error';

module.exports = {
    name: 'search',
    async execute(message: Message, args: Array<string | number>) {
        const queue = player.createQueue(message.guild, {
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

        const query = args.join(' ');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (!args[0]) return message.reply('**Berikan judul untuk mencari lagu**');

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            queue.destroy();
            message.channel.send({});
            return await message.reply({ content: DefaultError });
        }

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');

        const track = await player.search(query, {
            requestedBy: message.author
        });
        if (!track) return await message.channel.send({ content: DefaultError });

        const embed = new MessageEmbed()
        .setColor('#89e0dc')
        .setAuthor({name: 'Pilih angka untuk memulai lagu, ketik cancel untuk membatalkan', iconURL: message.client.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .setDescription('**1. ' + track.tracks[0].title + '\n' + '2. ' + track.tracks[1].title + '\n' + '3. ' + track.tracks[2].title + '\n' + '4. ' + track.tracks[3].title + '\n'  + '5. ' + track.tracks[4].title + '\n**')
        .setFooter({text: `Direquest oleh ${message.member.nickname || message.author.username}`, iconURL: message.author.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .setTimestamp();

        message.reply({embeds: [embed]});
        const collector = message.channel.createMessageCollector({
            filter: (user) => user.member.id === message.author.id,
            time: 60000
        });

        collector.on('collect', async (msg: Message): Promise<any | Message> => {
            const value = parseInt(msg.content);
            if (msg.content.toLowerCase() === 'cancel') return message.reply('**Query dibatalkan**') && collector.stop();
            if (!value || value < 0 || value > 5) return message.reply(DefaultError);
            await message.channel.send({ content: `Menambahkan lagu **${track.tracks[value - 1].title}** di **${message.member.voice.channel.name}...**` });
            collector.stop();
            queue.addTrack(track.tracks[value - 1]);
            if (!queue.playing) await queue.play();
        });
    },
};
