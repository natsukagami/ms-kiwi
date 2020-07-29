import TrackMetadata from "./track";

/**
 * WS extends the WebSocket interface to provide to provide additional type-inference.
 */
export default class WS extends WebSocket {
  /**
   *
   * @param host The host URL, of the form `ws://...` or `wss://...`
   */
  constructor(host: string) {
    super(host);
    Object.setPrototypeOf(this, WS.prototype);
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
  requestTrack(query: string, selector: Selector) {
    let nonce = Math.floor(Math.random()*1e9);
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
}

/**
 * A query forwarded to the server.
 */
interface Query {
  op: number;
  query?: string;
  selector?: Selector;
  nonce?: number
}
/**
 * Data trailer from server.
 */
interface MessageData {
  track?: TrackMetadata;
  listeners?: number;
  pos?: number;
  queue?: TrackMetadata[];
  silent?: boolean;
  startPos?: number;
}

/**
 * The selector object.
 */
export enum Selector {
  DZ = 1,
  CSN = 2,
  YT = 3,
}

export enum Op {
  SetClientsTrack     = 1,
  AllClientsSkip      = 2,
  ClientRequestTrack  = 3,
  ClientRequestSkip   = 4,
  SetClientsListeners = 5,
  TrackEnqueued       = 6,
  ClientRequestQueue  = 7,
  WebSocketKeepAlive  = 8,
  ClientRemoveTrack   = 9,
  ClientAudioStartPos = 10,
}

/** Message represents all kinds of messages sent from the server. */
export interface Message {
  op: Op,
  success: boolean,
  reason: string,
  data: MessageData,
  nonce: number,
}


