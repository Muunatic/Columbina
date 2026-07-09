import { basename, client } from '../client';
import { playerEvents } from './player/playerEvents';
import { PlayerManager } from '../core/playerManager';
import { Track } from '../utils/interface';
console.info(`Loading ${basename(__filename)}`);

client.on('shardDisconnect', () => {
    console.log('Disconnect');
});

client.on('shardReconnecting', () => {
    console.log('Reconnecting');
});

playerEvents.on('emptyChannel', async (player: PlayerManager) => {
    await player.textChannel.send('**No members in the voice channel**');
});

playerEvents.on('playerStart', async (player: PlayerManager, track: Track) => {
    await player.textChannel.send(`Now playing **${track.title}**`);
});

playerEvents.on('emptyQueue', async (player: PlayerManager) => {
    await player.textChannel.send('**No music left in the queue**');
});

playerEvents.on('playerError', (player: PlayerManager, error: Error) => {
    console.error(`Connection Error: ${error.message}`);
});

playerEvents.on('error', (player: PlayerManager, error: Error) => {
    console.error(error.message);
});
