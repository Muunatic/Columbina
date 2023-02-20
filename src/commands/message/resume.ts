import { player, Message } from '../../client';

module.exports = {
    name: 'resume',
    async execute(message: Message) {
        const queue = await player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply('**Tidak ada music yang berjalan**');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');
        if (queue.setPaused(false)) return message.reply('**Lagu sedang berlangsung**');
        queue.setPaused(false);
        message.reply('**Lagu dilanjutkan**');
    },
};
