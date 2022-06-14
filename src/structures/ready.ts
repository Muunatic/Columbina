import { client } from '../client';

client.on('ready', async () => {
    console.log(client.user?.username + '#' + client.user?.discriminator + ': Hello, World!');
    client.user?.setActivity({ name: 'Hello, World! | /help', type: 'PLAYING' });
    client.user?.setStatus('online');
});