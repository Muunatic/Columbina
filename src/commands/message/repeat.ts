import { player, Message, QueueRepeatMode } from '../../client';

module.exports = {
    name: 'repeat',
    async execute(message: Message) {
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply('**Tidak ada music yang berjalan**');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');
        const repeatmode = queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF);
        message.reply(repeatmode ? `Loop **${queue.repeatMode === 0 ? 'dimatikan' : 'dinyalakan'}**` : `Repeat mode **${queue.repeatMode === 0 ? 'dimatikan' : 'dinyalakan'}**`);
    },
};
