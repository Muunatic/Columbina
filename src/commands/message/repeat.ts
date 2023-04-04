import { player, Message, QueueRepeatMode } from '../../client';

module.exports = {
    name: 'repeat',
    aliases: ['loop'],
    async execute(message: Message) {
        const queue = player.nodes.get(message.guild.id);
        if (queue?.isPlaying() == null || queue.isPlaying() == false) return message.reply('**Tidak ada music yang berjalan**');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');
        queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);
        const nowMode = function(): number {
            if (queue.repeatMode === 0) {
                return 0;
            } else {
                return 1;
            }
        };
        message.reply(nowMode ? `Loop **${queue.repeatMode === 0 ? 'dimatikan' : 'dinyalakan'}**` : `Loop **${queue.repeatMode === 0 ? 'dimatikan' : 'dinyalakan'}**`);
    }
};
