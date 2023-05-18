import { player, EmbedBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, Message, ActionRowBuilder, MessageComponentInteraction } from '../../client';

module.exports = {
    name: 'nowplaying',
    async execute(message: Message) {
        const queue = player.nodes.get(message.guild.id);
        if (queue?.isPlaying() == null || queue.isPlaying() == false) return message.reply('**Tidak ada music yang berjalan**');
        if (!message.member.voice.channel) return message.reply('**Kamu tidak divoice channel!**');
        if (message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('**Kamu tidak divoice channel yang sama!**');

        const nowplayingembed = new EmbedBuilder()
        .setColor('#89e0dc')
        .setTitle(queue.currentTrack.title)
        .setThumbnail(queue.currentTrack.thumbnail)
        .setFooter({text: `Listening on ${queue.currentTrack.source}`, iconURL: message.client.user.avatarURL({extension: 'png', forceStatic: false, size: 1024})})
        .addFields(
            {name: 'Channel', value: `${queue.currentTrack.author}`, inline: true},
            {name: 'Requested by', value: `${queue.currentTrack.requestedBy.username}`, inline: true},
            {name: 'Duration', value: `${queue.currentTrack.duration}`, inline: true},
            {name: 'Source', value: `[${queue.currentTrack.source}](${queue.currentTrack.url})`, inline: true},
            {name: 'Views', value: `${queue.currentTrack.views}`, inline: true},
            {name: 'ID', value: `${queue.currentTrack.id}`, inline: true},
            {name: 'Progress Bar', value: `${queue.node.createProgressBar()}`, inline: true}
        )
        .setTimestamp();

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('resume')
            .setLabel('▶️')
            .setStyle(ButtonStyle.Success)
        )
        .addComponents(
            new ButtonBuilder()
            .setCustomId('pause')
            .setLabel('⏸️')
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
            .setCustomId('skip')
            .setLabel('⏭️')
            .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
            .setCustomId('stop')
            .setLabel('⏹️')
            .setStyle(ButtonStyle.Danger)
        );

        const btnfilter = (msg: MessageComponentInteraction) => msg.member.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter: btnfilter, time: 60000 });

        collector.on('collect', async (msg: ButtonInteraction) => {

            if (msg.customId === 'resume') {
                if (queue.node.isPaused() === true) {
                    queue.node.setPaused(false);
                    await msg.reply({content: '**Lagu telah diputar**'});
                    return;
                } else if (queue.node.isPaused() === false) {
                    msg.reply({content: '**Lagu sedang diputar**'});
                    return;
                }
            }

            if (msg.customId === 'pause') {
                if (queue.node.isPaused() ===  false) {
                    queue.node.setPaused(true);
                    await msg.reply({content: '**Lagu telah dipause**'});
                    return;
                } else if (queue.node.isPaused() == true) {
                    msg.reply({content: '**Lagu sedang dipause**'});
                    return;
                }
            }

            if (msg.customId === 'skip') {
                queue.node.skip();
                await msg.reply({content: '**Lagu telah diskip**'});
                return;
            }

            if (msg.customId === 'stop') {
                queue.delete();
                await msg.reply({content: '**Lagu distop**'});
                return;
            }

            collector.on('end', (collected) => console.log(collected.size));

        });

        await message.reply({embeds: [nowplayingembed], components: [row]}).then((msg) => {
            setTimeout(() => {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                row.components[2].setDisabled(true);
                row.components[3].setDisabled(true);
                msg.edit({components: [row]});
                collector.stop();
            }, 5000);
        });
    }
};
