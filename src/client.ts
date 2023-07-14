import { ActionRowBuilder, ActivityType, BaseGuildTextChannel, ButtonBuilder, ButtonInteraction, ButtonStyle, Client, Collection, CommandInteraction, EmbedBuilder, GatewayIntentBits, Interaction, Message, MessageComponentInteraction, Partials } from 'discord.js';
import { GuildQueue, Player, QueueRepeatMode, SearchResult, Track } from 'discord-player';
import { SpotifyExtractor, YoutubeExtractor} from '@discord-player/extractor';
import { token } from '../src/data/config';

const client = new Client({

    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
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

const player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        filter: "audioonly",
        highWaterMark: 1 << 25,
        dlChunkSize: 0
    }
});


(async () => {
    await player.extractors.register(YoutubeExtractor, {});
    await player.extractors.register(SpotifyExtractor, {});
})().catch((error: Error) => console.log(error.message));

export {
    ActionRowBuilder,
    ActivityType,
    BaseGuildTextChannel,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    Collection,
    CommandInteraction,
    EmbedBuilder,
    GuildQueue,
    Interaction,
    Message,
    MessageComponentInteraction,
    Player,
    QueueRepeatMode,
    SearchResult,
    Track,
    client,
    player,
    token
};
