export interface LyricsResult {
    trackName: string;
    artistName: string;
    plainLyrics: string | null;
}

export async function searchLyrics(query: string): Promise<LyricsResult | null> {
    try {
        const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(query)}`, {
            headers: { 'User-Agent': 'Undici' }
        });

        if (!res.ok) return null;

        const data = (await res.json()) as Array<{
            trackName: string;
            artistName: string;
            plainLyrics: string | null;
        }>;

        if (!data || data.length === 0) return null;

        const match = data.find((d) => d.plainLyrics) ?? data[0];

        return {
            trackName: match.trackName,
            artistName: match.artistName,
            plainLyrics: match.plainLyrics
        };
    } catch (err) {
        console.error('[searchLyrics] failed:', err);
        return null;
    }
}
