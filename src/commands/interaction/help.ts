const { SlashCommandBuilder } = require('@discordjs/builders');
import { MessageEmbed } from 'discord.js';
import { prefix } from '../../data/config';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help command'),
    async execute(interaction) {
    const embed = new MessageEmbed()

    .setColor('#89e0dc')
    .setTitle('Help commands')
    .setDescription(`Prefix = **${prefix}**`)
    .addFields(
        { name: 'General command', value: 'play, skip, stop, volume, repeat, pause, resume, queue, nowplaying' },
    )
    .setFooter({text: `Direquest oleh ${interaction.user.username}`, iconURL: interaction.user.avatarURL({format : 'png', dynamic : true, size : 1024})})
    .setTimestamp()
    
    interaction.reply({embeds: [embed]});
    },
};