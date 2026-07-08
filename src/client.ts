import { ActionRowBuilder, ActivityType, BaseGuildTextChannel, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, Collection, CommandInteraction, EmbedBuilder, GatewayIntentBits, Interaction, Message, MessageComponentInteraction, Partials } from 'discord.js';
import { ClientOptions, CmdOptions, ConstructorOptions } from './structures/option';
import { basename } from 'path';
import { token } from '../src/data/config';
import { name, version } from '../package.json';

class Core {
    public client: Client;
    public clientOptions: ClientOptions;

    constructor({ maintenanceMode = false }: ConstructorOptions = {}) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildExpressions,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildWebhooks
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User
            ]
        });

        this.clientOptions = {
            maintenanceMode,
            name: name,
            version: version
        };
    }

    public async start(): Promise<void> {
        try {
            await this.client.login(token).catch((error: Error) => console.error('\x1b[31mError\x1b[0m:', error.message));
        } catch (error: unknown) {
            throw new Error('Error running client', error);
        }
    }
}

const core = new Core();
const { client, clientOptions } = core;

(async () => {
    await core.start();
})().catch((err: Error) => console.error(err));

export {
    ActionRowBuilder,
    ActivityType,
    BaseGuildTextChannel,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Collection,
    CmdOptions,
    CommandInteraction,
    EmbedBuilder,
    Interaction,
    Message,
    MessageComponentInteraction,
    basename,
    client,
    clientOptions,
    token
};
