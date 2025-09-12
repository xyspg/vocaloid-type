export interface LyricLine {
    time: string;
    text: string;
}

export interface Song {
    slug: string;
    title: string;
    artist: string;
    bpm?: number;
    cover: string;
    video: string;
    lyrics: LyricLine[];
    lyrics_romaji: LyricLine[];
    variants?: {
        video: {
            name: string;
            url: string;
        }[];
    }
}
