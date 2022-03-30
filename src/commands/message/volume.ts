import { player } from '../../client';
import { prefix } from '../../data/config';

module.exports = {
    name: 'volume',
    async execute(message) {
        const queue = await player.getQueue(message.guild.id);
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        if (!queue || !queue.playing) return message.reply('**Tidak ada music yang berjalan**');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');
        if (Math.round(parseInt(args[1])) < 1 || Math.round(parseInt(args[1])) > 100) return message.reply('berikan nomor 1 - 100 !');
        queue.setVolume(args[1]);
        message.reply(`Volume telah diubah ke ${args[1]}%`);
    },
};