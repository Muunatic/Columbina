import { basename, client } from '../client';
import { VoiceState } from 'discord.js';
import { queues } from '../core/playerManager';
console.info(`Loading ${basename(__filename)}`);

client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => {
    const guildId = oldState.guild.id;
    const queue = queues.get(guildId);
    if (!queue) return;

    if (oldState.channelId === queue.voiceChannel.id || newState.channelId === queue.voiceChannel.id) {
        queue.checkEmpty();
    }
});
