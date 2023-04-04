console.info('Loading voice.ts');
import { GuildQueue, player } from '../client';
import { VoiceConnectionState, VoiceConnectionStatus } from '@discordjs/voice';

player.events.on('connection', (queue: GuildQueue) => {
    queue.dispatcher.voiceConnection.on('stateChange', (oldState: VoiceConnectionState, newState: VoiceConnectionState) => {
        if (oldState.status === VoiceConnectionStatus.Ready && newState.status === VoiceConnectionStatus.Connecting) {
            queue.dispatcher.voiceConnection.configureNetworking();
        }
    });
});
