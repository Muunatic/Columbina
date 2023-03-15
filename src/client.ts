import { Client, Collection, Intents, Interaction, Message, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageCollector, MessageComponentInteraction, VoiceState } from 'discord.js';
import { Player, QueueRepeatMode, Queue } from 'discord-player';

const client = new Client({
    
    intents:
    [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_BANS, 
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
        Intents.FLAGS.GUILD_INTEGRATIONS, 
        Intents.FLAGS.GUILD_INVITES, 
        Intents.FLAGS.GUILD_MEMBERS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS
    ],

    partials:
    [
        "CHANNEL",
        "GUILD_MEMBER",
        "GUILD_SCHEDULED_EVENT",
        "MESSAGE",
        "REACTION",
        "USER"
    ]

});

const player = new Player(client);

export {
    Collection,
    CommandInteraction,
    Interaction,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageCollector,
    MessageComponentInteraction,
    client,
    Player,
    player,
    Queue,
    QueueRepeatMode,
    VoiceState
};
