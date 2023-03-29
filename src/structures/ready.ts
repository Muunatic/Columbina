console.info('Loading ready.ts');
import { client, ActivityType } from '../client';

client.once('ready', () => {
    console.log(client.user.username + '#' + client.user.discriminator + ': Hello, World!');
});

client.on('shardReady', () => {
    client.user.setActivity({
        name: 'Hello, World!',
        type: ActivityType.Playing
    });
    client.user.setStatus('online');
});
