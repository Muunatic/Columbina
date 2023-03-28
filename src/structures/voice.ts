console.info('Loading voice.ts');
import { VoiceState } from 'discord.js';
import { client, player } from '../client';
import { VoiceConnectionStatus } from '@discordjs/voice';

player.on('connectionCreate', (queue) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    queue.connection.voiceConnection.on('stateChange', (oldState, newState) => {
        if (oldState.status === VoiceConnectionStatus.Ready && newState.status === VoiceConnectionStatus.Connecting) {
            queue.connection.voiceConnection.configureNetworking();
        }
    });
});

client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => {
    
    const queue = player.getQueue<any>(oldState.guild.id);
    if (oldState.member.user.bot) return;

    if (oldState.channelId && newState && oldState.channelId !== newState.channelId) {

        if (queue.connection.channel && newState.member.id === newState.guild.me.id || (newState.member.id !== newState.guild.me.id && oldState.channelId === queue.connection.channel.id)) {
            if (oldState.channel.members.filter((member) => !member.user.bot).size === 0) {
                queue.metadata.channel.send('**Tidak ada member di voice**');
                queue.destroy();
            } else {
                return;
            }
        }

        if (oldState.member.id === oldState.client.user.id && !newState.channelId) {
            if (oldState.channel.members.filter((member) => !member.user.bot).size === 0) {
                queue.metadata.channel.send('**Tidak ada member di voice**');
                queue.destroy();
            } else {
                return;
            }
        }

    }

});
