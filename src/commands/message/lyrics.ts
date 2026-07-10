import { EmbedBuilder } from 'discord.js';
import { CmdOptions, Message } from '../../client';
import { defaultError } from '../../structures/error';
import { queues } from '../../core/playerManager';
import { searchLyrics } from '../../core/lyrics';

const MAX_DESCRIPTION_LENGTH = 4096;

export = {
    name: 'lyrics',
    async execute(message: Message<true>) {
        const queue = queues.get(message.guild.id);
        if (!queue || !queue.isPlaying() || !queue.currentTrack) return message.reply('**No music is currently playing**');

        if (!message.member.voice.channel) return message.reply('**You are not in a voice channel!**');
        if (message.guild.members.me?.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id)
            return message.reply('**You are not in the same voice channel!**');

        const track = queue.currentTrack;
        const result = await searchLyrics(track.title);

        if (!result || !result.plainLyrics) return message.reply(defaultError);

        let lyrics = result.plainLyrics;
        let truncated = false;
        if (lyrics.length > MAX_DESCRIPTION_LENGTH) {
            lyrics = lyrics.slice(0, MAX_DESCRIPTION_LENGTH - 20) + '\n\n...(truncated)';
            truncated = true;
        }

        const embed = new EmbedBuilder()
            .setColor('#89e0dc')
            .setTitle(track.title)
            .setDescription(lyrics)
            .setThumbnail(track.thumbnail ?? null)
            .setFooter({
                text: truncated
                    ? `Lyrics truncated • Listening on ${track.source}`
                    : `Listening on ${track.source}`,
                iconURL: message.client.user.displayAvatarURL({ extension: 'png', forceStatic: false, size: 1024 })
            })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
} as CmdOptions;
