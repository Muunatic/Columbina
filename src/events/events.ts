console.info('Loading events.ts');
import { client, player } from '../client';

client.on('shardDisconnect', () => {
    console.log('Disconnect');
});

client.on('shardReconnecting', () => {
    console.log('Reconnecting');
});

player.on('channelEmpty', (queue) => {
    queue.metadata.channel.send('**Tidak ada member di voice**');
});

player.on('trackStart', (queue, track) => {
    queue.metadata.channel.send(`Memutar lagu **${track.title}**`);
});

player.on('queueEnd', (queue) => { 
    queue.metadata.channel.send('**Tidak ada music yang tersisa**');
});

player.on('connectionError', (error) => {
    console.log(`Connection Error: ${error.message}`);
});

player.on('error', (error) => {
    console.log(error.message);
});