import { player } from '../../client';

module.exports = {
    name: 'pause',
    async execute(message) {
        const queue = await player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply('**Tidak ada music yang berjalan**');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');
        if (queue.setPaused(true)) return message.reply('**Lagu sedang dipause**');
        queue.setPaused(true);
        message.reply('**Lagu telah dipause**');
    },
};