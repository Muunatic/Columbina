console.info('Loading ready.ts');
import { client, ActivityType } from '../client';

client.once('ready', () => {
    console.log(client.user.username + '#' + client.user.discriminator + '\x1b[32m' + ': Hello, World!' + '\x1b[0m');
});

client.on('shardReady', () => {
    client.user.setActivity({
        name: 'Hello, World! | /help',
        type: ActivityType.Playing
    });
});
