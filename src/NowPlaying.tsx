import { h } from "preact";
import WS, { Op, Message } from "./server/ws";
import { useState, useEffect } from "preact/hooks";
import TrackMetadata, { LyricsLine } from "./server/track";
import Track from "./TrackInfo";
import AS from "./server/audio";

/**
 * The now playing bar.
 * @param ws The websocket connection.
 */
export default function NowPlaying({ ws, host }: { ws: WS; host: string }) {
  // State: audio!
  const [audio, setAudio] = useState(() => new AS({ ws, host }));
  // State: currently playing track!
  const [currentTrack, setCurrentTrack] = useState<TrackMetadata | null>(null);
  // State: Listener count
  const [listeners, setListeners] = useState(0);
  // Effect: reload on unload
  useEffect(() => {
    audio.addEventListener(
      "error",
      () => {
        audio.reload();
      },
      { once: true }
    );
  }, [audio]);
  // Effect: trace the currently playing track.
  useEffect(() => {
    const remove = ws.addMessageHandler((m: Message) => {
      switch (m.op) {
        case Op.SetClientsTrack:
          console.log(m);
          setCurrentTrack(m.data!.track!);
          setListeners(m.data!.listeners!);
          return;
        case Op.SetClientsListeners:
          setListeners(m.data!.listeners!);
          return;
      }
    });
    ws.readyState === ws.OPEN && ws.getPlaying(); // Don't rely on the websocket connection to send you stuff first.
    return remove;
  }, [ws]);

  /// Render!
  // Don't display anything if there's no tracks playing.
  if (currentTrack === null) return null;

  return (
    <div class="flex flex-col h-64 justify-center overflow-x-visible flex-shrink-0">
      <ErrorMessageHandle ws={ws} />
      <div class="rounded p-4 bg-blue flex flex-row z-10 transition-all ease-in-out duration-1000 animate__animated">
        {/* Track Info */}
        <div class="flex-grow break-words">
          <Track track={currentTrack} listeners={listeners} />
        </div>
        {/* Play/Pause */}
        <div class="flex-shrink-0 w-16">
          <AudioHandle audio={audio} />
        </div>
        {/* Skip */}
        <div class="flex-shrink-0 w-16">
          <Skip ws={ws} />
        </div>
      </div>
      <LyricsHandle ws={ws} audio={audio} track={currentTrack} />
    </div>
  );
}
/**
 * The fallback error message handler
 * @param ws The websocket connection
 */
function ErrorMessageHandle({ ws }: { ws: WS }) {
  //State: active message
  const [activeMsg, setActiveMsg] = useState<Message | null>(null);
  useEffect(() => {
    return ws.addMessageHandler((m) => {
      //Because this is already handled from Search
      if (m.op == Op.ClientRequestTrack) return;

      if (!m.success && m.reason.length > 0) {
        setActiveMsg(m);
        setTimeout(() => {
          setActiveMsg((oldmsg) => {
            //Do not remove another active message
            if (oldmsg === m) return null;
            return oldmsg;
          });
        }, 3000);
      }
    });
  }, [ws]);

  //Render!
  if (activeMsg === null) return null;
  return (
    <div class="block mx-auto z-0 bg-blue bg-opacity-75 py-5 pt-5 pt-2 self-center rounded-t text-white animate__animated animate__slideInUp">
      <p class="px-2 text-xl text-red">{activeMsg.reason}</p>
    </div>
  );
}
/**
 * The lyrics bar
 * @param ws The websocket connection
 * @param audio The audio connection
 */
function LyricsHandle({
  ws,
  audio,
  track,
}: {
  ws: WS;
  audio: AS;
  track: TrackMetadata;
}) {
  //State: current lyrics line
  const [currentLine, setCurrentLine] = useState(-1);
  //State: current ticker
  const [currentInterval, setCurrentInterval] = useState<number | undefined>(
    undefined
  );
  //State: current lyrics
  const [lyrics, setLyrics] = useState<LyricsLine[] | null>(null);
  useEffect(() => {
    setLyrics(track.lyrics!.lrc);
    if (!!track.lyrics?.lrc && track.lyrics!.lrc.length > 0) {
      let idx = 0;
      setCurrentLine(idx);
      setCurrentInterval(
        setInterval(() => {
          while (
            track.lyrics!.lrc[idx].time.total <= audio.currentTrackTime()
          ) {
            idx++;
            setCurrentLine(idx);
            if (idx >= track.lyrics!.lrc.length) {
              setCurrentInterval((interval) => {
                clearInterval(interval);
                return undefined;
              });
              break;
            }
          }
        }, 100)
      );
    }
    return () => {
      clearInterval(currentInterval);
    };
  }, [track]);
  useEffect(() => {
    return ws.addMessageHandler((m) => {
      switch (m.op) {
        case Op.AllClientsSkip:
          setCurrentInterval((interval) => {
            clearInterval(interval);
            return undefined;
          });
          break;
      }
    });
  }, [ws]);

  //Render!

  if (
    track === null ||
    lyrics === null ||
    currentLine <= 0 ||
    currentLine >= lyrics.length
  )
    return null;

  return (
    <div class="w-11/12 z-0 bg-blue bg-opacity-75 py-5 pb-5 pt-2 self-center rounded-b text-white animate__animated animate__slideInDown overflow-y-hidden">
      <p class="px-2 text-xl text-accent">
        {!!lyrics![currentLine - 1].text
          ? lyrics![currentLine - 1].text
          : lyrics![currentLine - 1].original}
      </p>
      <p class="px-2">{lyrics![currentLine - 1].translated}</p>
    </div>
  );
}

/**
 * The component that controls audio.
 */
function AudioHandle({ audio }: { audio: AS }) {
  // State: are we paused?
  // can't really use the audio... we don't know if it's changed.
  const [paused, setPaused] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggle = () => {
    setLoading(true);
    if (paused) audio.unmute();
    else audio.mute();
    setLoading(false);
    setPaused(!paused);
  };

  // Render!
  return paused ? (
    <PlayBtn onClick={toggle} disabled={loading} />
  ) : (
      <PauseBtn onClick={toggle} disabled={loading} />
    );
}

function Skip({ ws }: { ws: WS }) {
  // State: either a state of wait (0 or 1), a boolean (success?) or null (nothing).
  const [status, setStatus] = useState<0 | 1 | boolean | null>(null);
  const setSkipped = (v: boolean) => {
    setStatus(v);
    setTimeout(() => setStatus(null), 3000);
  };
  // Effect: listen for global skip
  useEffect(() => {
    return ws.addMessageHandler((m) => {
      if (m.op === Op.AllClientsSkip) setSkipped(true);
    });
  }, [ws]);
  // Create a WS request and wait for response.
  const skip = () => {
    setStatus(0); // go back and forth between 0 and 1
    const statusCancel = setInterval(
      () => setStatus((v) => (v === 0 ? 1 : 0)),
      500
    );
    const cancel = ws.addMessageHandler((m) => {
      if (m.op === Op.ClientRequestSkip) {
        clearInterval(statusCancel);
        setSkipped(m.success!);
        if (!m.success) console.warn(`Cannot skip: ${m.reason}`);
        cancel();
      }
    });
    ws.requestSkip();
  };

  const additionalClasses =
    typeof status === "boolean"
      ? status
        ? "fill-green"
        : "fill-red"
      : status === null
        ? "fill-bg"
        : status === 0
          ? "fill-bg"
          : "fill-current";

  return (
    <SkipBtn
      disabled={status !== null}
      onClick={skip}
      className={additionalClasses}
    />
  );
}

interface BtnProps {
  onClick: () => void;
  disabled: boolean;
}

/**
 * Play button...
 */
function PlayBtn({ onClick, disabled }: BtnProps) {
  const hoverClass = disabled
    ? "cursor-not-allowed"
    : "hovers:hover:text-accent cursor-pointer";
  return (
    <svg
      class="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 250.488 250.488"
      xmlSpace="preserve"
      onClick={disabled ? undefined : onClick}
    >
      <g
        class={`stroke-current stroke-15 fill-bg text-white stroke-2 ${hoverClass}`}
        transform="translate(75,65) scale(0.5)"
      >
        <path
          style="fill-rule:evenodd;clip-rule:evenodd;"
          d="M203.791,99.628L49.307,2.294c-4.567-2.719-10.238-2.266-14.521-2.266   c-17.132,0-17.056,13.227-17.056,16.578v198.94c0,2.833-0.075,16.579,17.056,16.579c4.283,0,9.955,0.451,14.521-2.267   l154.483-97.333c12.68-7.545,10.489-16.449,10.489-16.449S216.471,107.172,203.791,99.628z"
        />
      </g>
    </svg>
  );
}

/**
 * Pause button...
 */
function PauseBtn({ onClick, disabled }: BtnProps) {
  const hoverClass = disabled
    ? "cursor-not-allowed"
    : "hovers:hover:text-accent cursor-pointer";
  return (
    <svg
      class="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 250.488 250.488"
      xmlSpace="preserve"
      onClick={disabled ? undefined : onClick}
    >
      <g
        class={`stroke-current stroke-15 fill-bg text-white stroke-2 ${hoverClass}`}
        transform="translate(75,65) scale(0.5)"
      >
        <path
          style="fill-rule:evenodd;clip-rule:evenodd;"
          d="M80.543,0H35.797c-9.885,0-17.898,8.014-17.898,17.898v196.883   c0,9.885,8.013,17.898,17.898,17.898h44.746c9.885,0,17.898-8.013,17.898-17.898V17.898C98.44,8.014,90.427,0,80.543,0z M196.882,0   h-44.746c-9.886,0-17.899,8.014-17.899,17.898v196.883c0,9.885,8.013,17.898,17.899,17.898h44.746   c9.885,0,17.898-8.013,17.898-17.898V17.898C214.781,8.014,206.767,0,196.882,0z"
        />
      </g>
    </svg>
  );
}

/**
 * Skip button...
 */
function SkipBtn({
  onClick,
  disabled,
  className = "",
}: {
  onClick: () => void;
  disabled: boolean;
  className?: string;
}) {
  const hoverClass = disabled
    ? "cursor-not-allowed"
    : "hovers:hover:text-accent cursor-pointer";
  return (
    <svg
      class="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 250.488 250.488"
      xmlSpace="preserve"
      onClick={disabled ? undefined : onClick}
    >
      <g
        class={`stroke-current stroke-15 fill-bg text-white stroke-2 duration-500 transition-all ${hoverClass} ${className}`}
        transform="translate(65,65) scale(0.5)"
      >
        <path d="M242.381,110.693L140.415,24.591c-3.48-2.406-7.805-2.005-11.071-2.005   c-13.061,0-13.003,11.7-13.003,14.666v65.249l-92.265-77.91c-3.482-2.406-7.807-2.005-11.072-2.005   C-0.057,22.587,0,34.287,0,37.252v175.983c0,2.507-0.057,14.666,13.004,14.666c3.265,0,7.59,0.401,11.072-2.005l92.265-77.91   v65.249c0,2.507-0.058,14.666,13.003,14.666c3.266,0,7.591,0.401,11.071-2.005l101.966-86.101   c9.668-6.675,7.997-14.551,7.997-14.551S252.049,117.367,242.381,110.693z" />
      </g>
    </svg>
  );
}
