import { h } from "preact";
import WS, { Op, Message } from "./server/ws";
import { useState, useEffect } from "preact/hooks";
import TrackMetadata, { LyricsLine } from "./server/track";
import Track from "./TrackInfo";
import AS from "./server/audio";
import Queue, { QueueBtn } from "./Queue";

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
  // State: queue visible?
  const [queueVisible, setQueueVisible] = useState(false);
  //State: active message
  const [activeMsg, setActiveMsg] = useState<Message | null>(null);
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
        case Op.ClientRequestTrack:
          return;
        default:
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
      }

    });
    ws.readyState === ws.OPEN && ws.getPlaying(); // Don't rely on the websocket connection to send you stuff first.
    return remove;
  }, [ws]);

  /// Render!
  // Don't display anything if there's no tracks playing.
  if (currentTrack === null) return null;

  return (
    <div class="flex flex-col overflow-x-visible flex-grow overflow-y-auto">
      <LyricsHandle ws={ws} audio={audio} track={currentTrack} />
      {/* <div class="rounded h-44 flex flex-row">
        <img src={currentTrack.cover} class="flex-grow object-contain"></img>
      </div> */}
      <div class="flex-shrink overflow-y-hidden rounded p-4 bg-blue flex flex-col z-10 transition-all ease-in-out duration-1000 animate__animated">
        {/* Track Info */}
        {activeMsg === null ? queueVisible ? (<Queue ws={ws} />) : (
          <div class="flex-grow break-words"><Track track={currentTrack} listeners={listeners} /></div>)
          : (<div class="flex flex-col justify-between text-white flex-grow">
            <a class="text-xl text-accent">{activeMsg.reason}</a>
          </div>)}
      </div>
      <div class="flex flex-none flex-row p-4 h-16">
        {/* Queue */}
        <div class="flex-grow w-1/3">
          <QueueBtn onClick={() => { setQueueVisible((x) => !x); }} disabled={false}></QueueBtn>
        </div>
        {/* Play/Pause */}
        <div class="flex-grow w-1/3">
          <AudioHandle audio={audio} />
        </div>
        {/* Skip */}
        <div class="flex-grow w-1/3">
          <Skip ws={ws} />
        </div>
      </div>
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
    currentLine >= lyrics.length
  )
    return null;

  return (
    <div class="flex-none w-11/12 z-0 bg-blue bg-opacity-75 pb-3 pt-2 self-center rounded-t text-white animate__animated animate__slideInUp overflow-y-hidden">
      <p class="px-2 text-lg text-accent">
        {currentLine - 1 >= 0 && currentLine - 1 < lyrics.length ? !!lyrics![currentLine - 1].text
          ? lyrics![currentLine - 1].text
          : lyrics![currentLine - 1].original : ""}
      </p>
      <p class="px-2">{currentLine - 1 >= 0 && currentLine - 1 < lyrics.length ? lyrics![currentLine - 1].translated : ""}</p>
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
      class="w-full h-full overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 256 256"
      xmlSpace="preserve"
      onClick={disabled ? undefined : onClick}
    >
      <g
        class={`stroke-current fill-bg text-white stroke-15 ${hoverClass}`}
      >
        <rect x="0" y="0" width="256" height="256" stroke="transparent" stroke-width="1" fill="transparent" fill-opacity="0.5" />
        <path d="M216.2,114.9L39.8,13.1c-10.1-5.8-22.6,1.5-22.6,13.1v203.7c0,11.6,12.6,18.9,22.6,13.1l176.4-101.8
	C226.3,135.2,226.3,120.7,216.2,114.9z"/>
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
      class="w-full h-full overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 256 256"
      xmlSpace="preserve"
      onClick={disabled ? undefined : onClick}
    >
      <g
        class={`stroke-current fill-bg text-white stroke-15 ${hoverClass}`}
      >
        <rect x="0" y="0" width="256" height="256" stroke="transparent" stroke-width="1" fill="transparent" fill-opacity="0.5" />
        <g>
          <path d="M20.5,236.5c0,11,9,20,20,20h49c11,0,20-9,20-20v-216c0-11-9-20-20-20h-49c-11,0-20,9-20,20V236.5z" />
        </g>
        <g>
          <path d="M147.5,236.5c0,11,9,20,20,20h49c11,0,20-9,20-20v-216c0-11-9-20-20-20h-49c-11,0-20,9-20,20V236.5z" />
        </g>
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
      class="w-full h-full overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 256 256"
      xmlSpace="preserve"
      onClick={disabled ? undefined : onClick}
    >
      <g
        class={`stroke-current fill-bg text-white stroke-15 duration-500 transition-all ${hoverClass} ${className}`}
      >
        <rect x="0" y="0" width="256" height="256" stroke="transparent" stroke-width="1" fill="transparent" fill-opacity="0.5" />
        <path d="M247.7,109.9L143.5,2.5c-3.6-3-8-2.5-11.3-2.5c-13.3,0-13.3,14.6-13.3,18.3v81.3L24.6,2.5C21-0.5,16.6,0,13.3,0
		C-0.1,0,0,14.6,0,18.3v219.4c0,3.1-0.1,18.3,13.3,18.3c3.3,0,7.8,0.5,11.3-2.5l94.3-97.1v81.3c0,3.1-0.1,18.3,13.3,18.3
		c3.3,0,7.8,0.5,11.3-2.5l104.2-107.3c9.9-8.3,8.2-18.1,8.2-18.1S257.6,118.2,247.7,109.9z"/>
      </g>
    </svg>
  );
}
