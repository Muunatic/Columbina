import { client } from './src/client';
import { token } from './src/data/config';

require('./src/client');
require('./structures/ready');
require('./structures/handler');
require('./structures/messageCreate');
require('./structures/interactionCreate');
require('./structures/error');
require('./events/events');

client.login(token);