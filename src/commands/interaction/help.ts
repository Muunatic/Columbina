import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from '../../client';
import { prefix } from '../../data/config';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help command'),
    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()

        .setColor('#89e0dc')
        .setTitle('Help commands')
        .setDescription(`Prefix = **${prefix}**`)
        .addFields({ name: 'General command', value: 'search, play, skip, stop, volume, repeat, pause, resume, queue, nowplaying' })
        .setFooter({text: `Direquest oleh ${interaction.user.username}`, iconURL: interaction.user.avatarURL({extension: 'png', forceStatic: false, size: 1024})})
        .setTimestamp();

        interaction.reply({embeds: [embed]});
    }
};
