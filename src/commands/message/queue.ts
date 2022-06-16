import { player } from '../../client';

module.exports = {
    name: 'queue',
    async execute(message) {
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply('**Tidak ada music yang berjalan**');
        if (!queue.tracks[0]) return message.reply(`**Music Queue**\nSedang berlangsung : **${queue.current.title}** | **${queue.current.author}**`);
        await message.reply(`**Music Queue**\nSedang berlangsung : **${queue.current.title}** | **${queue.current.author}**\n\n` + (queue.tracks.map((track, i) => {
            return `**#${i + 1}** - **${track.title}** | **${track.author}** (direquest oleh : **${track.requestedBy.username}**)`
        }).slice(0, 5).join('\n') + `\n\n${queue.tracks.length > 5 ? `dan **${queue.tracks.length - 5}** lagu lain...` : `Playlist **${queue.tracks.length}**...`}`));
    },
};