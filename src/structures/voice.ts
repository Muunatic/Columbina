console.info('Loading voice.ts');
import { client, player } from '../client';

client.on('voiceStateUpdate', (oldState, newState) => {
    
    const queue = player.getQueue(oldState.guild.id);

    if (oldState.member?.user.bot) return;

    if (oldState.channelId && newState && oldState.channelId !== newState.channelId) {

        if (queue.connection.channel && newState.member?.id === newState.guild.me?.id || (newState.member?.id !== newState.guild.me?.id && oldState.channelId === queue.connection.channel?.id)) {
            if (oldState.channel?.members.filter((member) => !member.user.bot).size === 0) {
                queue.metadata.channel.send('**Tidak ada member di voice**');
                queue.destroy();
            } else {
                return;
            }
        }

        if (oldState.member?.id === oldState.client.user?.id && !newState.channelId) {
            if (oldState.channel?.members.filter((member) => !member.user.bot).size === 0) {
                queue.metadata.channel.send('**Tidak ada member di voice**');
                queue.destroy();
            } else {
                return;
            }
        }

    }

});