console.info('Loading voice.ts');
import { player } from '../client';
import { VoiceConnectionStatus } from '@discordjs/voice';

player.events.on('connection', (queue) => {
    queue.dispatcher.voiceConnection.on('stateChange', (oldState, newState) => {
        if (oldState.status === VoiceConnectionStatus.Ready && newState.status === VoiceConnectionStatus.Connecting) {
            queue.dispatcher.voiceConnection.configureNetworking();
        }
    });
});
