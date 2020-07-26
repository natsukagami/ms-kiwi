import TrackMetadata from "./track";
import { Op, Message } from "./ws";
import Track from "../TrackInfo";

export default class AS extends Audio {
  host: string;
  currentTrack: TrackMetadata | null;
  diff: number;
  isFallback: boolean;
  wasSkipped: boolean;
  constructor(host: string) {
    super();
    this.host = host;
    this.diff = 0;
    this.wasSkipped = false;
    this.crossOrigin = "anonymous";
    this.preload = "auto";
    this.autoplay = true;
    this.mute();
    this.reload();
    this.isFallback = this.audioPath().includes("/fallback");
    this.currentTrack = null;
  }
  audioPath() {
    if (!this.canPlayType("audio/ogg")) {
      return `/fallback`;
    } else return `/audio`;
  }
  reload() {
    this.src = this.audioPath();
  }
  mute() {
    this.muted = true;
  }
  unmute() {
    this.muted = false;
    if (!this.src) this.reload();
  }
  currentTrackTime() {
    return this.currentTime - this.diff;
  }
  handleMessage(m: Message) {
    if (m.op == Op.AllClientsSkip) {
      this.wasSkipped = true;
      return;
    }
    let delta = m.data.pos! / 48000.0 + 1.584;
    this.diff = delta - this.currentTime;
    if (
      this.wasSkipped ||
      !this.currentTrack ||
      (this.currentTrack.source == 0 && m.data.track!.source != 0)
    ) {
      this.reload();
    } else if (Math.abs(this.diff) > 8 && !this.isFallback) {
      if (m.data.track!.source == 0) {
        setTimeout(() => {
          this.reload();
        }, (this.diff - 3.168) * 1000);
      } else {
        this.reload();
      }
    }
    this.wasSkipped = false;
    this.currentTrack = m.data.track!;
  }
}
