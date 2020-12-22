/**
 * TrackMetadata contains essential informations about a track for client.
 */
export default interface TrackMetadata {
  title: string;
  is_radio: boolean;
  duration: number;
  artist: string;
  artists: string;
  album: string;
  cover: string;
  lyrics: LyricsResult;
  playId: string;
  spotifyURI: string;
  id: string;
  href: string;
}

/**
 * LyricsResult represents a result of a lyrics query.
 */
export interface LyricsResult {
  txt: string;
  lrc: LyricsLine[];
  lang: string;
}

/**
 * LyricsTime represents the time that the lyrics will be shown.
 */
export interface LyricsTime {
  hundredths: number;
  minutes: number;
  seconds: number;
  total: number;
}

/**
 * LyricsLine contains informations about a piece of lyrics.
 */
export interface LyricsLine {
  text: string;
  translated: string;
  time: LyricsTime;
  original: string;
}
