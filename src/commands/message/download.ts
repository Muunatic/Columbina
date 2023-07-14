import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, Message, MessageComponentInteraction } from '../../client';
import { defaultError } from '../../structures/error';
import fs from 'node:fs';
import ytdl, { Filter } from 'ytdl-core';

module.exports = {
    name: 'download',
    async execute(message: Message, args: ReadonlyArray<string>) {
        if (!args[0]) return message.reply('**Berikan url YouTube <https://www.youtube.com/watch?v=>**');
        if (ytdl.validateURL(args[0]) == true) {
            let mimeType: string, filterVal: string, qualityVal: string, srcSize: string, srcFormat: ytdl.videoFormat;
            const srcInfo = ytdl.getInfo(args[0]);
            const mp3Size = (parseInt(ytdl.chooseFormat((await srcInfo).formats, {filter: 'audioonly', quality: 'highestaudio'}).contentLength) / 1024 / 1024).toFixed(2) + ' MB';
            const mp4Size = (parseInt(ytdl.chooseFormat((await srcInfo).formats, {filter: 'audioandvideo', quality: 'highest'}).contentLength) / 1024 / 1024).toFixed(2) + ' MB';
            const extType: string[] = [ "mp3", "mp4" ];

            const embed = new EmbedBuilder()
            .setColor('#89e0dc')
            .setURL((await srcInfo).videoDetails.video_url)
            .setTitle((await srcInfo).videoDetails.title)
            .setDescription('**Maximum Download Size: 8 MB**')
            .setThumbnail((await srcInfo).videoDetails.thumbnails[0].url)
            .addFields(
                {name: '🎵 MP3', value: `${mp3Size ? mp3Size === 'NaN MB' ? 'Unavailable' : mp3Size : mp3Size === 'NaN MB' ? 'Unavailable' : mp3Size}`, inline: false},
                {name: '📹 MP4', value: `${mp4Size ? mp4Size === 'NaN MB' ? 'Unavailable' : mp4Size : mp4Size === 'NaN MB' ? 'Unavailable' : mp4Size}`, inline: false}
            )
            .setFooter({text: `Direquest oleh ${message.author.username}`, iconURL: message.author.avatarURL({extension: 'png', forceStatic: false, size : 1024})})
            .setTimestamp();

            const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('mp3')
                .setLabel('🎵 MP3')
                .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId('mp4')
                .setLabel('📹 MP4')
                .setStyle(ButtonStyle.Primary)
            );

            const btnFilter = (msg: MessageComponentInteraction): boolean => msg.member.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({ filter: btnFilter, time: 30000 });

            await message.reply({embeds: [embed], components: [row]}).then((msg) => {
                collector.on('collect', async (msgButton: ButtonInteraction) => {
                    row.components[0].setDisabled(true) && row.components[1].setDisabled(true);
                    await msgButton.update({components: [row]});
                    collector.stop();
                    if (msgButton.customId === extType.find(a => msgButton.customId === a)) {
                        mimeType = msgButton.customId;
                        mimeType ? mimeType === 'mp4' ? ( filterVal = 'audioandvideo', qualityVal = 'highest' ) : ( filterVal = 'audioonly', qualityVal = 'highestaudio' ) : mimeType  === 'mp4' ? ( filterVal = 'audioandvideo', qualityVal = 'highest' ) : ( filterVal = 'audioonly', qualityVal = 'highestaudio' );
                        srcFormat = ytdl.chooseFormat((await srcInfo).formats, {filter: filterVal as Filter, quality: qualityVal});
                        srcSize = (parseInt(srcFormat.contentLength) / 1024 / 1024).toFixed(2);
                        if (parseInt(srcSize) < 8.00 && parseInt(srcSize) >= 0.00) {
                            await message.react('✅');
                            ytdl(args[0], {filter: filterVal as Filter, quality: qualityVal})
                            .pipe(fs.createWriteStream(message.id + `.${mimeType}`))
                            .on('error', () => {
                                void (async () => {
                                    await message.reply(defaultError);
                                })();
                            })
                            .on('finish', () => {
                                (async () => {
                                    await message.reply({files: [{
                                        attachment: message.id + `.${mimeType}`,
                                        name: (await srcInfo).videoDetails.title + `.${mimeType}`,
                                        description: 'Direquest oleh ' + message.author.username
                                    }]}).then(() => {
                                        fs.unlink(message.id + `.${mimeType}`, (err: Error) => {
                                            if (err) throw err.message;
                                        });
                                    });
                                })().catch((err) => console.error(err));
                            });
                        } else {
                            await message.reply(`**Ukuran file ${mimeType} melebihi 8 MB!**`);
                        }
                    }

                    collector.on('end', (collected) => void collected.size);
                });

                setTimeout(() => {
                    (async () => {
                        row.components[0].setDisabled(true) && row.components[1].setDisabled(true);
                        await msg.edit({components: [row]});
                        collector.stop();
                    })().catch((err) => console.log(err));
                }, 15000);
            });
        } else {
            return message.reply({content: defaultError});
        }
    }
};
