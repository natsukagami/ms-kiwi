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
  }

  /**
   * Assign a message handler.
   * @param fn The message handler.
   */
  addMessageHandler(fn: (this: WS, m: Message) => void) {
    super.addEventListener("message", (me) => {
      fn.call(this, me.data);
    });
  }

  private query(q: Query) {
    super.send(JSON.stringify(q));
  }

  /** Requests the current playing track */
  getPlaying() {
    this.query({ op: OpSetClientsTrack });
  }

  /** Request a track */
  requestTrack(query: string, selector: Selector) {
    this.query({ op: OpClientRequestTrack, query, selector });
  }

  /** Request a skip */
  requestSkip() {
    this.query({ op: OpClientRequestSkip });
  }

  /** Get the amount of listeners */
  getListeners() {
    this.query({ op: OpSetClientsListeners });
  }

  /** Remove track with given query */
  removeTrack(query: string) {
    this.query({ op: OpClientRemoveTrack, query });
  }

  /** Request the queue */
  getQueue() {
    this.query({ op: OpClientRequestQueue });
  }

  /** Ping! */
  ping() {
    this.query({ op: OpClientKeepAlive });
  }
}

/**
 * A query forwarded to the server.
 */
interface Query {
  op: number;
  query?: string;
  selector?: Selector;
}

export const SelectorDeezer = 1;
export const SelectorCSN = 2;
export const SelectorYoutube = 3;
type Selector =
  | typeof SelectorDeezer
  | typeof SelectorCSN
  | typeof SelectorYoutube;

/** Message represents all kinds of messages sent from the server. */
export type Message =
  | SetClientsTrack
  | AllClientsSkip
  | ClientRequestTrack
  | ClientRequestSkip
  | SetClientsListeners
  | TrackEnqueued
  | ClientRequestQueue
  | ClientKeepAlive
  | ClientRemoveTrack;

export const OpSetClientsTrack = 1;
type SetClientsTrack = {
  op: typeof OpSetClientsTrack;
  track: TrackMetadata;
  pos: number;
  listeners: number;
};

export const OpAllClientsSkip = 2;
type AllClientsSkip = {
  op: typeof OpAllClientsSkip;
};

export const OpClientRequestTrack = 3;
type ClientRequestTrack = {
  op: typeof OpClientRequestTrack;
} & (
  | {
      success: false;
      reason: string;
    }
  | {
      success: true;
      track: TrackMetadata;
    }
);

export const OpClientRequestSkip = 4;
type ClientRequestSkip = {
  op: typeof OpClientRequestSkip;
} & ({ success: false; reason: string } | { success: true });

export const OpSetClientsListeners = 5;
type SetClientsListeners = {
  op: typeof OpSetClientsListeners;
  listeners: number;
};

export const OpTrackEnqueued = 6;
type TrackEnqueued = {
  op: typeof OpTrackEnqueued;
  track: TrackMetadata;
};

export const OpClientRequestQueue = 7;
type ClientRequestQueue = {
  op: typeof OpClientRequestQueue;
  queue: TrackMetadata[];
};

export const OpClientKeepAlive = 8;
type ClientKeepAlive = {
  op: typeof OpClientKeepAlive;
};

export const OpClientRemoveTrack = 9;
type ClientRemoveTrack = {
  op: typeof OpClientRemoveTrack;
} & (
  | { success: false; reason?: string }
  | { success: true; track: TrackMetadata; silent?: true }
);
