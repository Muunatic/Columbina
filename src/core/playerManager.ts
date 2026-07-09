import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioResource,
    NoSubscriberBehavior,
    StreamType,
    VoiceConnection,
    VoiceConnectionStatus,
    createAudioPlayer,
    createAudioResource,
    entersState,
    joinVoiceChannel
} from '@discordjs/voice';
import { Guild, GuildTextBasedChannel, VoiceBasedChannel } from 'discord.js';
import { MusicQueueOptions, RepeatMode, Track, defaultOptions } from '../utils/interface';
import { AudioStreamHandle, createAudioStream, createProgressBar, formatDuration } from './ytdl';
import { playerEvents } from '../events/player/playerEvents';

export class PlayerManager {
    public readonly guild: Guild;
    public textChannel: GuildTextBasedChannel;
    public voiceChannel: VoiceBasedChannel;
    public connection: VoiceConnection | null = null;
    public player: AudioPlayer;
    public tracks: Track[] = [];
    public current: Track | null = null;
    public options: Required<MusicQueueOptions>;
    public repeatMode: RepeatMode = RepeatMode.Off;

    private currentStream: AudioStreamHandle | null = null;
    private currentResource: AudioResource<null> | null = null;
    private emptyTimeout: NodeJS.Timeout | null = null;
    private endTimeout: NodeJS.Timeout | null = null;
    private volume = 100;

    constructor(
        guild: Guild,
        voiceChannel: VoiceBasedChannel,
        textChannel: GuildTextBasedChannel,
        options: MusicQueueOptions = {}
    ) {
        this.guild = guild;
        this.voiceChannel = voiceChannel;
        this.textChannel = textChannel;
        this.options = { ...defaultOptions, ...options };

        this.player = createAudioPlayer({
            behaviors: { noSubscriber: NoSubscriberBehavior.Pause }
        });

        this.player.on(AudioPlayerStatus.Idle, async () => {
            this.currentStream?.kill();
            this.currentStream = null;
            this.currentResource = null;
            await this.playNext();
        });

        this.player.on('error', async (error) => {
            console.error('[MusicQueue] player error:', error);
            playerEvents.emit('playerError', this, error);
            this.currentStream?.kill();
            this.currentStream = null;
            this.currentResource = null;
            await this.playNext();
        });
    }

    async connect(): Promise<void> {
        this.connection = joinVoiceChannel({
            channelId: this.voiceChannel.id,
            guildId: this.guild.id,
            adapterCreator: this.guild.voiceAdapterCreator,
            selfDeaf: this.options.selfDeaf
        });

        await entersState(this.connection, VoiceConnectionStatus.Ready, 15000);
        this.connection.subscribe(this.player);

        this.connection.on(VoiceConnectionStatus.Disconnected, () => this.destroy());
    }

    async addTrack(track: Track): Promise<void> {
        this.clearEndTimeout();
        this.tracks.push(track);
        if (!this.current) {
            await this.playNext();
        }
    }

    private playNext(): Promise<void> {
        const finished = this.current;

        if (finished && this.repeatMode === RepeatMode.Track) {
            this.tracks.unshift(finished);
        } else if (finished && this.repeatMode === RepeatMode.Queue) {
            this.tracks.push(finished);
        }

        const next = this.tracks.shift();
        if (!next) {
            this.current = null;
            playerEvents.emit('emptyQueue', this);
            this.scheduleLeaveOnEnd();
            return;
        }

        this.current = next;
        this.currentStream = createAudioStream(next.url);

        const resource = createAudioResource(this.currentStream.stream, {
            inputType: StreamType.Raw,
            inlineVolume: true
        });

        resource.volume?.setVolume(this.volume / 100);
        this.currentResource = resource;

        this.player.play(resource);
        playerEvents.emit('playerStart', this, next);
    }

    isPlaying(): boolean {
        return this.player.state.status === AudioPlayerStatus.Playing;
    }

    isPaused(): boolean {
        return this.player.state.status === AudioPlayerStatus.Paused;
    }

    get currentTrack(): Track | null {
        return this.current;
    }

    pause(): boolean {
        return this.player.pause(true);
    }

    resume(): boolean {
        return this.player.unpause();
    }

    getVolume(): number {
        return this.volume;
    }

    setVolume(vol: number): void {
        const clamped = Math.max(0, Math.min(200, vol));
        this.volume = clamped;
        this.currentResource?.volume?.setVolume(clamped / 100);
    }

    setRepeatMode(mode: RepeatMode): void {
        this.repeatMode = mode;
    }

    getProgress(): { currentSeconds: number; totalSeconds: number; bar: string; formatted: string; } {
        const totalSeconds = this.current?.duration ?? 0;
        const currentMs = this.currentResource?.playbackDuration ?? 0;
        const currentSeconds = Math.floor(currentMs / 1000);

        const bar = createProgressBar(currentSeconds, totalSeconds);
        const formatted = `${formatDuration(currentSeconds)} / ${formatDuration(totalSeconds)}`;

        return { currentSeconds, totalSeconds, bar, formatted };
    }

    private scheduleLeaveOnEnd(): void {
        if (!this.options.leaveOnEnd) return;
        this.clearEndTimeout();
        this.endTimeout = setTimeout(async () => {
            await this.textChannel.send('Queue is empty.');
            this.destroy();
        }, this.options.leaveOnEndCooldown);
    }

    private clearEndTimeout(): void {
        if (this.endTimeout) {
            clearTimeout(this.endTimeout);
            this.endTimeout = null;
        }
    }

    public checkEmpty(): void {
        if (!this.options.leaveOnEmpty) return;

        const members = this.voiceChannel.members.filter((m) => !m.user.bot);

        if (members.size === 0) {
            playerEvents.emit('emptyChannel', this);
            this.scheduleLeaveOnEmpty();
        } else {
            this.clearEmptyTimeout();
        }
    }

    private scheduleLeaveOnEmpty(): void {
        this.clearEmptyTimeout();
        this.emptyTimeout = setTimeout(async () => {
            await this.textChannel.send('Voice channel is empty.');
            this.destroy();
        }, this.options.leaveOnEmptyCooldown);
    }

    private clearEmptyTimeout(): void {
        if (this.emptyTimeout) {
            clearTimeout(this.emptyTimeout);
            this.emptyTimeout = null;
        }
    }

    skip(): void {
        this.player.stop(true);
    }

    stop(): void {
        this.tracks = [];
        this.repeatMode = RepeatMode.Off;
        this.player.stop(true);
    }

    destroy(): void {
        this.clearEmptyTimeout();
        this.clearEndTimeout();
        this.currentStream?.kill();
        this.currentResource = null;
        this.player.stop(true);
        this.connection?.destroy();
        queues.delete(this.guild.id);
    }
}

export const queues = new Map<string, PlayerManager>();
