import { client, token } from './src/client';

import './src/client';
import './src/structures/error';
import './src/structures/ready';
import './src/structures/handler';
import './src/structures/interactionCreate';
import './src/structures/messageCreate';
import './src/structures/voice';
import './src/events/events';

client.login(token).catch((error: Error) => console.error('\x1b[31mError\x1b[0m:', error.message));
