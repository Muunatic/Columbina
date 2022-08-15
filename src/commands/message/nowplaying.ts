import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
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
        .addFields(
            {name: 'Channel', value: `${queue.current.author}`, inline: true},
            {name: 'Requested by', value: `${queue.current.requestedBy.username}`, inline: true},
            {name: 'Duration', value: `${queue.current.duration}`, inline: true},
            {name: 'Source', value: `${queue.current.source}`, inline: true},
            {name: 'Views', value: `${queue.current.views}`, inline: true},
            {name: 'ID', value: `${queue.current.id}`, inline: true},
            {name: 'Progress Bar', value: `${queue.createProgressBar()}`, inline: true}
        )
        .setTimestamp()

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('resume')
            .setLabel('▶️')
            .setStyle('SUCCESS')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('pause')
            .setLabel('⏸️')
            .setStyle('PRIMARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('skip')
            .setLabel('⏭️')
            .setStyle('PRIMARY')
        )
        .addComponents(
            new MessageButton()
            .setCustomId('stop')
            .setLabel('⏹️')
            .setStyle('DANGER')
        )

        const btnfilter = msg => msg.member.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter: btnfilter, time: 60000 });

        collector.on('collect', async msg => {

            if (msg.customId === 'resume') {
                const queue = player.getQueue(message.guild.id);
                if (queue.setPaused(false)) return msg.reply({content: '**Lagu berlangsung**'});
                queue.setPaused(false);
                await msg.reply({content: '**Lagu telah diresume**'});
                collector.stop();
            }

            if (msg.customId === 'pause') {
                const queue = player.getQueue(message.guild.id);
                if (queue.setPaused(true)) return msg.reply({content: '**Lagu dipause**'});
                queue.setPaused(true);
                await msg.reply({content: '**Lagu telah dipause**'});
                collector.stop();
            }

            if (msg.customId === 'skip') {
                const queue = player.getQueue(message.guild.id);
                queue.skip();
                await msg.reply({content: '**Lagu diskip**'});
                collector.stop();
            }

            if (msg.customId === 'stop') {
                const queue = player.getQueue(message.guild.id);
                queue.destroy();
                await msg.reply({content: '**Lagu distop**'});
                collector.stop();
            }
    
            collector.on('end', collected => console.log(collected.size));

        });

        message.reply({embeds: [nowplayingembed], components: [button]}).then(msg => {
                setTimeout(() => {
                    button.components[0].setDisabled(true);
                    button.components[1].setDisabled(true);
                    button.components[2].setDisabled(true);
                    button.components[3].setDisabled(true);
                    msg.edit({components: [button]});
                    collector.stop();
                }, 10000)
            }
        )
    },
};