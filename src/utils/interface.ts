import { User } from 'discord.js';

export interface Track {
    url: string;
    title: string;
    duration: number;
    durationFormatted: string;
    thumbnail?: string;
    author?: string;
    views?: number;
    source: 'youtube';
    requestedBy: User;
}

export enum RepeatMode {
    Off = 0,
    Track = 1,
    Queue = 2
}

export interface MusicQueueOptions {
    selfDeaf?: boolean;
    leaveOnEnd?: boolean;
    leaveOnEndCooldown?: number;
    leaveOnEmpty?: boolean;
    leaveOnEmptyCooldown?: number;
}

export const defaultOptions: Required<MusicQueueOptions> = {
    selfDeaf: true,
    leaveOnEnd: true,
    leaveOnEndCooldown: 5000,
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 5000
};
