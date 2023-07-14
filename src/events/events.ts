console.info('Loading events.ts');
import { GuildQueue, Track, client, player } from '../client';

client.on('shardDisconnect', () => {
    console.log('Disconnect');
});

client.on('shardReconnecting', () => {
    console.log('Reconnecting');
});

player.events.on('emptyChannel', (queue: GuildQueue<any>) => {
    queue.metadata.channel.send('**Tidak ada member di voice**');
});

player.events.on('playerStart', (queue: GuildQueue<any>, track: Track) => {
    queue.metadata.channel.send(`Memutar lagu **${track.title}**`);
});

player.events.on('emptyQueue', (queue: GuildQueue<any>) => {
    queue.metadata.channel.send('**Tidak ada music yang tersisa**');
});

player.events.on('playerError', (error: any) => {
    console.error(`Connection Error: ${error.message}`);
});

player.events.on('error', (error: any) => {
    console.error(error.message);
});
