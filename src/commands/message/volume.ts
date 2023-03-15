import { Message } from 'discord.js';
import { player } from '../../client';

module.exports = {
    name: 'volume',
    async execute(message: Message, args: Array<string>) {
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply('**Tidak ada music yang berjalan**');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');
        if (Math.round(parseInt(args[0])) < 1 || Math.round(parseInt(args[0])) > 100) return message.reply('berikan nomor 1 - 100 !');
        queue.setVolume(parseInt(args[0]));
        message.reply(`Volume telah diubah ke ${args[0]}%`);
    },
};
