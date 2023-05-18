import { player, Message } from '../../client';

module.exports = {
    name: 'volume',
    async execute(message: Message, args: Array<string>) {
        const queue = player.nodes.get(message.guild.id);
        if (queue?.isPlaying() == null || queue.isPlaying() == false) return message.reply('**Tidak ada music yang berjalan**');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');
        if (!args[0] || Math.round(parseInt(args[0])) < 1 || Math.round(parseInt(args[0])) > 100) return message.reply('**berikan nomor 1 - 100 !**');
        queue.node.setVolume(parseInt(args[0]));
        message.reply(`Volume telah diubah ke **${args[0]}%**`);
    }
};
