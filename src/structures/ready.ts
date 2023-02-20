console.info('Loading ready.ts');
import { client } from '../client';

client.once('ready', () => {
    console.log(client.user.username + '#' + client.user.discriminator + ': Hello, World!');
});

client.on('shardReady', () => {
    client.user.setActivity({ name: 'Hello, World! | /help', type: 'PLAYING' });
    client.user.setStatus('online');
});
