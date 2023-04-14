import { client } from './src/client';
import { token } from './src/data/config';

import './src/client';
import './src/structures/error';
import './src/structures/ready';
import './src/structures/handler';
import './src/structures/interactionCreate';
import './src/structures/messageCreate';
import './src/structures/voice';
import './src/events/events';

client.login(token);
