import TrackMetadata from "./track";
import WS, { Op, Message } from "./ws";

/**
 * AS extends the Audio interface to provide to provide additional type-inference.
 */
export default class AS extends Audio {
  host: string;
  currentTrack: TrackMetadata | null;
  delta: number;
  isFallback: boolean;
  wasSkipped: boolean;
  audioStartPos: number;
  /**
   *
   * @param ws the status websocket connection
   * @param host the host URL
   */
  constructor({ ws, host }: { ws: WS; host: string }) {
    super();
    Object.setPrototypeOf(this, AS.prototype);
    ws.addMessageHandler(this.handleMessage.bind(this));
    this.host = host;
    this.delta = 0;
    this.audioStartPos = 0;
    this.wasSkipped = false;
    this.crossOrigin = "use-credentials";
    this.preload = "auto";
    this.autoplay = true;
    this.mute();
    this.isFallback = this.audioPath().includes("/fallback");
    this.currentTrack = null;
  }
  audioPath() {
    if (!this.canPlayType("audio/ogg")) {
      return `/fallback`;
    } else return `/audio`;
  }
  catchUpLive() {
    if (
      this.networkState != this.NETWORK_LOADING ||
      this.readyState != this.HAVE_ENOUGH_DATA
    )
      this.load();
    else {
      if (this.buffered.length > 0)
        this.fastSeek(this.buffered.end(this.buffered.length - 1));
    }
  }
  reload() {
    this.src = this.audioPath();
  }
  mute() {
    this.muted = true;
  }
  unmute() {
    eval("window.audio = this;");
    this.muted = false;
    if (!this.src) {
      this.reload();
      this.play();
    } else if (this.paused) {
      this.play();
    } else {
      this.load();
    }
  }
  currentTrackTime() {
    return this.currentTime - this.delta + this.audioStartPos;
  }
  handleMessage(m: Message) {
    if (m.op == Op.AllClientsSkip) {
      this.wasSkipped = true;
      return;
    }
    if (m.op == Op.ClientAudioStartPos) {
      if (eval("!window.chrome") || navigator.userAgent.match("CriOS")) {
        this.audioStartPos = m.data.startPos! / 48000.0;
      }
      return;
    }
    if (m.op != Op.SetClientsTrack) return;
    let delta = m.data.pos! / 48000.0 + 1.584;
    this.delta = delta;
    let diff = delta - this.currentTime;
    if (
      this.wasSkipped ||
      (!!this.currentTrack &&
        this.currentTrack.source == 0 &&
        m.data.track!.source != 0)
    ) {
      this.catchUpLive();
    } else if (Math.abs(diff) > 8) {
      if (m.data.track!.source == 0) {
        setTimeout(() => {
          this.catchUpLive();
        }, (diff - 3.168) * 1000);
      } else {
        this.catchUpLive();
      }
    }
    this.wasSkipped = false;
    this.currentTrack = m.data.track!;
    this.title = `${this.currentTrack.title} - ${this.currentTrack.artist}`;
  }
}
