import { CmdOptions, EmbedBuilder, Message } from '../../client';
import { defaultError } from '../../structures/error';
import { PlayerManager, queues } from '../../core/playerManager';
import { resolveMultipleTracks } from '../../core/ytdl';

export = {
    name: 'search',
    async execute(message: Message<true>, args: ReadonlyArray<string>) {
        const query = args.join(' ');

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('**You are not in a voice channel!**');

        if (message.guild.members.me?.voice.channel && voiceChannel.id !== message.guild.members.me.voice.channel.id)
            return message.reply('**You are not in the same voice channel!**');

        if (voiceChannel.full) return message.reply('**Voice channel is full!**');

        if (!args[0]) return message.reply('**Provide a title to search for a song**');

        const results = await resolveMultipleTracks(query, message.author, 5);
        if (results.length === 0) return message.channel.send({ content: defaultError });

        const embed = new EmbedBuilder()
            .setColor('#89e0dc')
            .setThumbnail(results[0].thumbnail ?? null)
            .setAuthor({
                name: 'Choose a number to start playing the song, type cancel to cancel operation',
                iconURL: message.client.user.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 })
            })
            .setDescription(results.map((track, i) => `${i + 1}. **[${track.title}](${track.url})**`).join('\n'))
            .setFooter({
                text: `Requested by ${message.author.username}`,
                iconURL: message.author.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 })
            })
            .setTimestamp();

        await message.reply({ embeds: [embed] });

        const collector = message.channel.createMessageCollector({
            filter: (msg) => msg.author.id === message.author.id,
            time: 60000
        });

        collector.on('collect', async (msg: Message) => {
            if (msg.content.toLowerCase() === 'cancel') {
                await msg.reply('**Query canceled**');
                collector.stop();
                return;
            }

            const value = parseInt(msg.content, 10);
            if (!value || value < 1 || value > results.length) {
                await msg.reply(defaultError);
                return;
            }

            const chosen = results[value - 1];
            collector.stop();

            let queue = queues.get(message.guild.id);
            if (!queue) {
                queue = new PlayerManager(message.guild, voiceChannel, message.channel);
                try {
                    await queue.connect();
                } catch {
                    queue.destroy();
                    await message.channel.send({ content: defaultError });
                    return;
                }
                queues.set(message.guild.id, queue);
            }

            await message.channel.send({ content: `Adding song **${chosen.title}** to **${voiceChannel.name}...**` });
            await queue.addTrack(chosen);
        });
    }
} as CmdOptions;
