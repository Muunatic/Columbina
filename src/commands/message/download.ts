import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, MessageComponentInteraction } from 'discord.js';
import { CmdOptions, Message } from '../../client';
import { defaultError } from '../../structures/error';
import { downloadAsMp3, downloadAsMp4, getDownloadInfo, isYoutubeUrl } from '../../core/ytdl';
import fs from 'node:fs';
import path from 'node:path';

const MAX_SIZE_MB = 8;
const TMP_DIR = path.join(process.cwd(), 'tmp');

export = {
    name: 'download',
    async execute(message: Message<true>, args: ReadonlyArray<string>) {
        if (!args[0]) return message.reply('**Provide a YouTube URL <https://www.youtube.com/watch?v=>**');
        if (!isYoutubeUrl(args[0])) return message.reply({ content: defaultError });

        const info = await getDownloadInfo(args[0]);
        if (!info) return message.reply({ content: defaultError });

        const formatSize = (mb: number | null): string => {
            if (mb === null || isNaN(mb)) return 'Unavailable';
            return `${mb.toFixed(2)} MB`;
        };

        const embed = new EmbedBuilder()
            .setColor('#89e0dc')
            .setURL(info.url)
            .setTitle(info.title)
            .setDescription(`**Maximum Download Size: ${MAX_SIZE_MB} MB**`)
            .setThumbnail(info.thumbnail ?? null)
            .addFields(
                { name: '🎵 MP3', value: formatSize(info.mp3SizeMB), inline: false },
                { name: '📹 MP4', value: formatSize(info.mp4SizeMB), inline: false }
            )
            .setFooter({
                text: `Requested by ${message.author.username}`,
                iconURL: message.author.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 })
            })
            .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId('mp3').setLabel('🎵 MP3').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('mp4').setLabel('📹 MP4').setStyle(ButtonStyle.Primary)
        );

        const reply = await message.reply({ embeds: [embed], components: [row] });

        const btnFilter = (i: MessageComponentInteraction): boolean => i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter: btnFilter, time: 30000 });

        collector.on('collect', async (interaction: ButtonInteraction) => {
            row.components.forEach((btn) => btn.setDisabled(true));
            await interaction.update({ components: [row] });
            collector.stop();

            const mimeType = interaction.customId as 'mp3' | 'mp4';

            await message.react('✅');

            if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

            const outputPath = path.join(TMP_DIR, `${message.id}.${mimeType}`);

            try {
                if (mimeType === 'mp3') {
                    await downloadAsMp3(args[0], outputPath);
                } else {
                    await downloadAsMp4(args[0], outputPath);
                }

                const stats = fs.statSync(outputPath);
                const sizeMB = stats.size / 1024 / 1024;

                if (sizeMB > MAX_SIZE_MB) {
                    await message.reply(`**The file size of ${mimeType} exceeds ${MAX_SIZE_MB} MB!**`);
                    fs.unlink(outputPath, () => null);
                    return;
                }

                await message.reply({
                    files: [
                        {
                            attachment: outputPath,
                            name: `${info.title}.${mimeType}`,
                            description: `Requested by ${message.author.username}`
                        }
                    ]
                });
            } catch (err) {
                console.error('[download] failed:', err);
                await message.reply(defaultError);
            } finally {
                fs.unlink(outputPath, () => null);
            }
        });

        collector.on('end', () => {
            row.components.forEach((btn) => btn.setDisabled(true));
            void reply.edit({ components: [row] }).catch((): void => null);
        });
    }
} as CmdOptions;
