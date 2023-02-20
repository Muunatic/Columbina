console.info('Loading events.ts');
import { Queue } from 'discord-player';
import { client, player } from '../client';

client.on('shardDisconnect', () => {
    console.log('Disconnect');
});

client.on('shardReconnecting', () => {
    console.log('Reconnecting');
});

player.on('channelEmpty', (queue: Queue<any>) => {
    queue.metadata.channel.send('**Tidak ada member di voice**');
});

player.on('trackStart', (queue: Queue<any>, track) => {
    queue.metadata.channel.send(`Memutar lagu **${track.title}**`);
});

player.on('queueEnd', (queue: Queue<any>) => { 
    queue.metadata.channel.send('**Tidak ada music yang tersisa**');
});

player.on('connectionError', (error: any) => {
    console.error(`Connection Error: ${error.message}`);
});

player.on('error', (error: any) => {
    console.error(error.message);
});
