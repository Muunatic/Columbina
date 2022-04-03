import { MessageEmbed } from 'discord.js';
import { player } from '../../client';

module.exports = {
    name: 'nowplaying',
    async execute(message) {
        const queue = player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply('**Tidak ada music yang berjalan**');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');
        const nowplayingembed = new MessageEmbed()
        .setColor('#89e0dc')
        .setTitle(queue.current.title)
        .setThumbnail(queue.current.thumbnail)
        .setFooter({text: queue.current.url, iconURL: message.client.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
        .addField('Channel', `${queue.current.author}`, true)
        .addField('Requested by', `${queue.current.requestedBy.username}`, true)
        .addField('Duration', `${queue.current.duration}`, true)
        .addField('Source', `${queue.current.source}`, true)
        .addField('Views', `${queue.current.views}`, true)
        .addField('ID', `${queue.current.id}`, true)
        .addField('Progress Bar', `${queue.createProgressBar()}`, true)
        .setTimestamp()

        message.reply({embeds: [nowplayingembed]});
    },
};