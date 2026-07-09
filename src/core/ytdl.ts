import { Readable } from 'node:stream';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import youtubedl, { Payload } from 'youtube-dl-exec';
import ffmpegPath from 'ffmpeg-static';
import { User } from 'discord.js';
import { Track } from '../utils/interface';

const URL_REGEX = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/i;

export async function resolveTrack(query: string, requestedBy: User): Promise<Track | null> {
    const isUrl = URL_REGEX.test(query);
    const target = isUrl ? query : `ytsearch1:${query}`;

    try {
        const output = (await youtubedl(target, {
            dumpSingleJson: true,
            noPlaylist: true,
            noWarnings: true,
            noCheckCertificates: true,
            preferFreeFormats: true,
            skipDownload: true
        })) as Payload & { entries?: Payload[]; };

        const info = output.entries ? output.entries[0] : output;
        if (!info) return null;

        const duration = info.duration ?? 0;

        return {
            url: info.webpage_url ?? info.original_url ?? query,
            title: info.title,
            duration,
            durationFormatted: formatDuration(duration),
            thumbnail: info.thumbnail,
            author: info.uploader ?? info.channel ?? undefined,
            views: info.view_count ?? undefined,
            source: 'youtube',
            requestedBy
        };
    } catch (err) {
        console.error('[resolveTrack] failed to resolve track:', err);
        return null;
    }
}

export async function resolveMultipleTracks(query: string, requestedBy: User, limit = 5): Promise<Track[]> {
    const target = `ytsearch${limit}:${query}`;

    try {
        const output = (await youtubedl(target, {
            dumpSingleJson: true,
            noPlaylist: true,
            noWarnings: true,
            noCheckCertificates: true,
            preferFreeFormats: true,
            skipDownload: true
        })) as Payload & { entries?: Payload[]; };

        const entries = output.entries ?? [];
        if (entries.length === 0) return [];

        return entries.map((info) => {
            const duration = info.duration ?? 0;
            return {
                url: info.webpage_url ?? info.original_url ?? '',
                title: info.title,
                duration,
                durationFormatted: formatDuration(duration),
                thumbnail: info.thumbnail,
                author: info.uploader ?? info.channel ?? undefined,
                views: info.view_count ?? undefined,
                source: 'youtube' as const,
                requestedBy
            };
        });
    } catch (err) {
        console.error('[resolveMultipleTracks] failed to resolve tracks:', err);
        return [];
    }
}

export interface AudioStreamHandle {
    stream: Readable;
    kill: () => void;
}

export function createAudioStream(url: string): AudioStreamHandle {
    const ytdlpProcess = youtubedl.exec(
        url,
        {
            output: '-',
            format: 'bestaudio/best',
            noPlaylist: true,
            quiet: true,
            noWarnings: true,
            noCheckCertificates: true
        },
        { stdio: ['ignore', 'pipe', 'ignore'] }
    );

    ytdlpProcess.catch(() => { });

    const ffmpegProcess = spawn(
        ffmpegPath as unknown as string,
        ['-i', 'pipe:0', '-analyzeduration', '0', '-loglevel', '0', '-f', 's16le', '-ar', '48000', '-ac', '2', 'pipe:1'],
        { stdio: ['pipe', 'pipe', 'ignore'] }
    );

    ytdlpProcess.stdout?.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code !== 'EPIPE') console.error('[ytdlp stdout error]', err);
    });

    ffmpegProcess.stdin.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code !== 'EPIPE') console.error('[ffmpeg stdin error]', err);
    });

    ytdlpProcess.stdout!.pipe(ffmpegProcess.stdin);

    let killed = false;
    const kill = (): void => {
        if (killed) return;
        killed = true;

        ytdlpProcess.stdout?.unpipe(ffmpegProcess.stdin);

        ytdlpProcess.kill('SIGKILL');
        ffmpegProcess.kill('SIGKILL');
    };

    const ytdlpProc = ytdlpProcess as unknown as ChildProcessWithoutNullStreams;

    ytdlpProc.stdout.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code !== 'EPIPE') console.error('[ytdlp stdout error]', err);
    });

    ytdlpProc.on('error', kill);
    ffmpegProcess.on('error', kill);

    return { stream: ffmpegProcess.stdout as Readable, kill };
}

export function formatDuration(totalSeconds: number): string {
    if (!totalSeconds || totalSeconds <= 0) return '0:00';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const pad = (n: number): string => n.toString().padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${minutes}:${pad(seconds)}`;
}

export function createProgressBar(current: number, total: number, size = 15): string {
    if (!total || total <= 0) return '▬'.repeat(size);

    const ratio = Math.min(Math.max(current / total, 0), 1);
    const filledIndex = Math.round(ratio * size);

    const bar = Array.from({ length: size }, (_, i) => (i === filledIndex ? '🔘' : '▬')).join('');
    return bar;
}

const YT_URL_REGEX = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/i;

export function isYoutubeUrl(url: string): boolean {
    return YT_URL_REGEX.test(url);
}

export interface DownloadInfo {
    title: string;
    url: string;
    thumbnail?: string;
    mp3SizeMB: number | null;
    mp4SizeMB: number | null;
}

export async function getDownloadInfo(url: string): Promise<DownloadInfo | null> {
    try {
        const info = (await youtubedl(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificates: true,
            preferFreeFormats: true,
            skipDownload: true
        })) as Payload & { entries?: Payload[]; };

        const formats = info.formats ?? [];

        const audioFormats = formats.filter((f) => f.vcodec === 'none' && f.acodec !== 'none');
        const bestAudio = audioFormats.sort((a, b) => (b.abr ?? 0) - (a.abr ?? 0))[0];
        const audioBytes = bestAudio?.filesize ?? bestAudio?.filesize_approx ?? null;

        const combinedFormats = formats.filter((f) => f.vcodec !== 'none' && f.acodec !== 'none');
        const bestCombined = combinedFormats.sort((a, b) => (b.height ?? 0) - (a.height ?? 0))[0];
        const videoBytes = bestCombined?.filesize ?? bestCombined?.filesize_approx ?? null;

        return {
            title: info.title,
            url: info.webpage_url ?? url,
            thumbnail: info.thumbnail,
            mp3SizeMB: audioBytes ? audioBytes / 1024 / 1024 : null,
            mp4SizeMB: videoBytes ? videoBytes / 1024 / 1024 : null
        };
    } catch (err) {
        console.error('[getDownloadInfo] failed:', err);
        return null;
    }
}

export async function downloadAsMp3(url: string, outputPath: string): Promise<void> {
    await youtubedl(url, {
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        output: outputPath,
        noWarnings: true,
        noCheckCertificates: true,
        ffmpegLocation: ffmpegPath as unknown as string
    });
}

export async function downloadAsMp4(url: string, outputPath: string): Promise<void> {
    await youtubedl(url, {
        format: 'bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best',
        mergeOutputFormat: 'mp4',
        output: outputPath,
        noWarnings: true,
        noCheckCertificates: true,
        ffmpegLocation: ffmpegPath as unknown as string
    });
}
