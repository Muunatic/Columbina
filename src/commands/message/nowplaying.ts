import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    MessageComponentInteraction
} from 'discord.js';
import { CmdOptions, Message } from '../../client';
import { queues } from '../../core/playerManager';
import { RepeatMode } from '../../utils/interface';

export = {
    name: 'nowplaying',
    async execute(message: Message<true>) {
        const queue = queues.get(message.guild.id);
        if (!queue || !queue.isPlaying() || !queue.currentTrack) return message.reply('**No music is currently playing**');
        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');
        if (message.guild.members.me?.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id)
            return message.reply('**You are not in the same voice channel!**');

        const track = queue.currentTrack;
        const progress = queue.getProgress();

        const embed = new EmbedBuilder()
            .setColor('#89e0dc')
            .setTitle(track.title)
            .setURL(track.url)
            .setThumbnail(track.thumbnail ?? null)
            .setFooter({
                text: `Listening on ${track.source}`,
                iconURL: message.client.user.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 })
            })
            .addFields(
                { name: 'Channel', value: track.author ?? 'Unknown', inline: true },
                { name: 'Duration', value: track.durationFormatted, inline: true },
                { name: 'Views', value: track.views ? track.views.toLocaleString() : 'N/A', inline: true },
                { name: 'Source', value: `[${track.source}](${track.url})`, inline: true },
                { name: 'Requested by', value: track.requestedBy.username, inline: true },
                { name: 'Repeat Mode', value: queue.repeatMode === RepeatMode.Off ? 'Off' : queue.repeatMode === RepeatMode.Track ? 'Track' : 'Queue', inline: true },
                { name: 'Progress', value: `${progress.bar}\n${progress.formatted}`, inline: false }
            )
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId('resume').setLabel('▶️').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('pause').setLabel('⏸️').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('skip').setLabel('⏭️').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('stop').setLabel('⏹️').setStyle(ButtonStyle.Danger)
        );

        const btnFilter = (i: MessageComponentInteraction): boolean => i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter: btnFilter, time: 60000 });

        collector.on('collect', async (interaction: ButtonInteraction) => {
            const liveQueue = queues.get(message.guild.id);
            if (!liveQueue) {
                await interaction.reply({ content: '**Queue no longer exists**', ephemeral: true });
                return;
            }

            switch (interaction.customId) {
                case 'resume':
                    if (liveQueue.isPaused()) {
                        liveQueue.resume();
                        await interaction.reply({ content: '**Song has been resumed**' });
                    } else {
                        await interaction.reply({ content: '**Song is already playing**', ephemeral: true });
                    }
                    break;
                case 'pause':
                    if (!liveQueue.isPaused()) {
                        liveQueue.pause();
                        await interaction.reply({ content: '**Song has been paused**' });
                    } else {
                        await interaction.reply({ content: '**Song is already paused**', ephemeral: true });
                    }
                    break;
                case 'skip':
                    liveQueue.skip();
                    await interaction.reply({ content: '**Song has been skipped**' });
                    break;
                case 'stop':
                    liveQueue.destroy();
                    await interaction.reply({ content: '**Song has been stopped**' });
                    break;
                default:
                    await interaction.reply({ content: '**Unknown action**', ephemeral: true });
            }
        });

        collector.on('end', () => {
            row.components.forEach((btn) => btn.setDisabled(true));
            void reply.edit({ components: [row] }).catch((): void => null);
        });

        const reply = await message.reply({ embeds: [embed], components: [row] });

        setTimeout(() => collector.stop(), 60000);
    }
} as CmdOptions;
