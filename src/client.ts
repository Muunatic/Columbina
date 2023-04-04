import { Client, GatewayIntentBits, Partials, Collection, ActivityType, EmbedBuilder, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, BaseGuildTextChannel, MessageComponentInteraction, Interaction, CommandInteraction } from 'discord.js';
import { Player, GuildQueue, QueueRepeatMode, Track } from 'discord-player';

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

export {
    ActionRowBuilder, 
    ActivityType, 
    BaseGuildTextChannel, 
    ButtonBuilder, 
    ButtonInteraction, 
    ButtonStyle, 
    client, 
    Collection, 
    CommandInteraction,
    EmbedBuilder, 
    GuildQueue, 
    Interaction, 
    Message, 
    MessageComponentInteraction, 
    Player, 
    player, 
    QueueRepeatMode, 
    Track
};
