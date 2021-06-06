import TrackMetadata from "./track";

/**
 * WS extends the WebSocket interface to provide to provide additional type-inference.
 */
export default class WS extends WebSocket {
  pingIntervalID: number | undefined;
  /**
   *
   * @param host The host URL, of the form `ws://...` or `wss://...`
   */
  constructor(host: string) {
    super(host);
    Object.setPrototypeOf(this, WS.prototype);
    super.addEventListener("open", () => {
      this.pingIntervalID = setInterval(() => {
        this.ping();
      }, 45000);
    });
    super.addEventListener("close", () => {
      clearInterval(this.pingIntervalID);
      this.pingIntervalID = undefined;
    });
  }

  /**
   * Assign a message handler.
   * @param fn The message handler.
   * @returns The remove handler function.
   */
  addMessageHandler(
    fn: (this: WS, m: Message) => void,
    opts?: AddEventListenerOptions | boolean
  ) {
    const f = (me: MessageEvent) => {
      fn.call(this, JSON.parse(me.data));
    };
    super.addEventListener("message", f, opts);
    return () => super.removeEventListener("message", f);
  }

  private query(q: Query) {
    super.send(JSON.stringify(q));
  }

  /** Requests the current playing track */
  getPlaying() {
    this.query({ op: Op.SetClientsTrack });
  }

  /** Request a track */
  requestTrack(query: string, selector: number) {
    let nonce = Math.floor(Math.random() * 1e9);
    this.query({ op: Op.ClientRequestTrack, query, selector, nonce });
    return nonce;
  }

  /** Request a skip */
  requestSkip() {
    this.query({ op: Op.ClientRequestSkip });
  }

  /** Get the amount of listeners */
  getListeners() {
    this.query({ op: Op.SetClientsListeners });
  }

  /** Remove track with given query */
  removeTrack(query: string) {
    this.query({ op: Op.ClientRemoveTrack, query });
  }

  /** Request the queue */
  getQueue() {
    this.query({ op: Op.ClientRequestQueue });
  }

  /** Ping! */
  ping() {
    this.query({ op: Op.WebSocketKeepAlive });
  }

  /** Request sources list */
  getSourcesList() {
    this.query({ op: Op.ListSources });
  }
}

/**
 * A query forwarded to the server.
 */
interface Query {
  op: number;
  query?: string;
  selector?: number;
  nonce?: number;
}
/**
 * Information about a server's music source
 */
export interface MusicSourceInfo {
  name: string;
  display_name: string;
  id: number;
}
/**
 * Data trailer from server.
 */
interface MessageData {
  track?: TrackMetadata;
  listeners?: number;
  pos?: number;
  fallbackpos?: number;
  queue?: TrackMetadata[];
  silent?: boolean;
  startPos?: number;
  sources?: MusicSourceInfo[];
}

export enum Op {
  ListSources = 1,
  SetClientsTrack = 2,
  AllClientsSkip = 3,
  ClientRequestTrack = 4,
  ClientRequestSkip = 5,
  SetClientsListeners = 6,
  TrackEnqueued = 7,
  ClientRequestQueue = 8,
  WebSocketKeepAlive = 9,
  ClientRemoveTrack = 10,
  ClientAudioStartPos = 11,
}

/** Message represents all kinds of messages sent from the server. */
export interface Message {
  op: Op;
  success: boolean;
  reason: string;
  data: MessageData;
  nonce: number;
}
