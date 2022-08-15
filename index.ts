import { client } from './src/client';
import { token } from './src/data/config';

require('./src/client');
require('./src/structures/error');
require('./src/structures/ready');
require('./src/structures/handler');
require('./src/structures/interactionCreate');
require('./src/structures/messageCreate');
require('./src/structures/voice');
require('./src/events/events');

client.login(token);