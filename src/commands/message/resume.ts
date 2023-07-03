import { Message, player } from '../../client';

module.exports = {
    name: 'resume',
    async execute(message: Message) {
        const queue = player.nodes.get(message.guild.id);
        if (queue?.isPlaying() == null || queue.isPlaying() == false) return message.reply('**Tidak ada music yang berjalan**');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');
        if (queue.node.isPaused() == false) return message.reply('**Lagu sedang berlangsung**');
        queue.node.setPaused(false);
        message.reply('**Lagu dilanjutkan**');
    }
};
