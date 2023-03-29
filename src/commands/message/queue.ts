import { player, Message } from '../../client';

module.exports = {
    name: 'queue',
    async execute(message: Message) {
        const queue = player.nodes.get(message.guild.id);
        if (queue?.isPlaying() == null || queue.isPlaying() == false) return message.reply('**Tidak ada music yang berjalan**');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');
        if (!queue.tracks.data[0]) return message.reply(`**Music Queue**\nSedang berlangsung : **${queue.currentTrack.title}** | **${queue.currentTrack.author}**`);
        await message.reply(`**Music Queue**\nSedang berlangsung : **${queue.currentTrack.title}** | **${queue.currentTrack.author}**\n\n` + (queue.tracks.data.map((track, i) => {
            return `**#${i + 1}** - **${track.title}** | **${track.author}** (direquest oleh : **${track.requestedBy.username}**)`;
        }).slice(0, 5).join('\n') + `\n\n${queue.tracks.data.length > 5 ? `dan **${queue.tracks.data.length - 5}** lagu lain...` : `Playlist **${queue.tracks.data.length}**...`}`));
    }
};
