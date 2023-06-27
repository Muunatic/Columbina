console.info('Loading ready.ts');
import { ActivityType, client } from '../client';
import clientPackage from '../../package.json';

client.once('ready', async () => {
    console.log(client.user.username + '#' + client.user.discriminator + ': \x1b[32m' + 'Hello, World!' + '\x1b[0m');
});

client.on('shardReady', () => {
    client.user.setActivity({
        name: 'Hello, World! | /help',
        type: ActivityType.Playing
    });
});

const checkSemver = async () => {
    await fetch('https://api.github.com/repos/Muunatic/Columbina/releases/latest', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if (data) {
            if (data.tag_name != clientPackage.version) {
                return console.warn('\n\n \x1b[33m' + 'WARN' + '\x1B[0m' + ': ' + clientPackage.name.charAt(0).toUpperCase() + clientPackage.name.slice(1) + ' is ' + '\x1b[31moutdated\x1b[0m' + `! download new release \x1b[32mv${data.tag_name}\x1b[0m from \x1b[34m${data.html_url}\x1b[0m \n\n`);
            } else {
                return true;
            }
        } else {
            return false;
        }
    });
};
checkSemver();
