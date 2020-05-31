import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import WS from "./server/ws";
import Search from "./Search";
import NowPlaying from "./NowPlaying";

/**
 * Main app.
 *
 * @param host The server host URL.
 */
function App({ host }: { host: string }) {
  /// The websocket connection.
  const newWs = () => new WS(`${host.replace(/^http/, "ws")}/status`);
  const [ws, setWs] = useState(newWs());
  /// Effect: reload ws
  useEffect(() => {
    ws.addEventListener("close", () => setWs(newWs()), {once: true});
  }, [ws]);
  /// Current track information.
  // const [currentTrack, setCurrentTrack] = useState<TrackMetadata | null>(null);
  /// Queue
  // const [queue, setQueue] = useState<TrackMetadata[]>([]);
  /// Listeners count
  // const [listeners, setListeners] = useState(0);

  /// Rendering here
  return (
    <div class="mx-auto md:max-w-screen-md max-w-full px-4 pt-4 h-screen">
      <div class="flex flex-col justify-between w-full h-full">
        {/* Search bar */}
        <Search ws={ws} />
        {/* Currently playing */}
        <NowPlaying ws={ws} host={host} />
        {/* Queue */}
        <div class="rounded-t-lg pt-4 bg-blue-900 bg-opacity-75 text-gray-400 ">
          <p class="mx-4 mb-2 text-2xl">In Queue</p>
          {/* List */}
          <div class="divide-y divide-gray-400 overflow-y-auto h-96 hover:h-144 scrolling-touch transition-all duration-200">
            {/* Item */}
            <div class="hover:bg-white hover:text-black transition-all duration-200 flex flex-row justify-between">
              {/* Track Info */}
              <div class="mx-4 py-2 flex flex-col justify-between flex-grow">
                <p class="text-xl text-red-600">Track name</p>
                <p>Track artist</p>
                <p>Listeners: 1</p>
              </div>
              {/* Remove button */}
              <div class="flex-shrink-0 mx-4 w-12 my-auto">
                <svg
                  class="cursor-pointer hover:text-red-600"
                  x="0"
                  y="0"
                  viewBox="-2 -2 30 30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g class="stroke-current stroke-1">
                    <path d="m14.66 19.02-.35-.35.7-.7.35.35c.2.19.2.51 0 .7-.09.1-.22.15-.35.15s-.26-.05-.35-.15z" />
                    <path
                      d="m9.675 7.48h.99v12.7h-.99z"
                      transform="matrix(.707 -.707 .707 .707 -6.801 11.242)"
                    />
                    <path d="m22.63 8.47-7.09-7.08c-.53-.52-1.38-.52-1.9 0l-7.61 7.6-.36-.36c-.19-.2-.51-.2-.7 0l7.96-7.95c.91-.91 2.4-.91 3.31 0l7.1 7.08c.44.44.68 1.03.68 1.66 0 .62-.24 1.21-.68 1.65l-7.97 7.96-.01-.01c.2-.19.2-.51 0-.7l-.35-.35 7.62-7.61c.25-.25.39-.58.39-.94s-.14-.7-.39-.95z" />
                    <path d="m6.03 8.99-.7.7-.36-.36c-.2-.19-.2-.51 0-.7.19-.2.51-.2.7 0z" />
                    <path d="m15.37 19.03-4.3 4.29c-.46.45-1.06.68-1.66.68s-1.2-.23-1.65-.68l-7.1-7.08c-.44-.44-.68-1.03-.68-1.66 0-.62.24-1.21.68-1.65l4.31-4.3c-.2.19-.2.51 0 .7l.36.36-3.96 3.95c-.25.25-.39.58-.39.94s.14.7.39.95l7.09 7.08c.52.52 1.38.52 1.9 0l3.95-3.94.35.35c.09.1.22.15.35.15s.26-.05.35-.15z" />
                  </g>
                </svg>
              </div>
            </div>
            {/* Item */}
            <div class="hover:bg-white hover:text-black transition-all duration-200 flex flex-row justify-between">
              {/* Track Info */}
              <div class="mx-4 py-2 flex flex-col justify-between flex-grow">
                <p class="text-xl text-red-600">Track name</p>
                <p>Track artist</p>
                <p>Listeners: 1</p>
              </div>
              {/* Remove button */}
              <div class="flex-shrink-0 mx-4 w-12 my-auto">
                <svg
                  class="cursor-pointer hover:text-red-600"
                  x="0"
                  y="0"
                  viewBox="-2 -2 30 30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g class="stroke-current stroke-1">
                    <path d="m14.66 19.02-.35-.35.7-.7.35.35c.2.19.2.51 0 .7-.09.1-.22.15-.35.15s-.26-.05-.35-.15z" />
                    <path
                      d="m9.675 7.48h.99v12.7h-.99z"
                      transform="matrix(.707 -.707 .707 .707 -6.801 11.242)"
                    />
                    <path d="m22.63 8.47-7.09-7.08c-.53-.52-1.38-.52-1.9 0l-7.61 7.6-.36-.36c-.19-.2-.51-.2-.7 0l7.96-7.95c.91-.91 2.4-.91 3.31 0l7.1 7.08c.44.44.68 1.03.68 1.66 0 .62-.24 1.21-.68 1.65l-7.97 7.96-.01-.01c.2-.19.2-.51 0-.7l-.35-.35 7.62-7.61c.25-.25.39-.58.39-.94s-.14-.7-.39-.95z" />
                    <path d="m6.03 8.99-.7.7-.36-.36c-.2-.19-.2-.51 0-.7.19-.2.51-.2.7 0z" />
                    <path d="m15.37 19.03-4.3 4.29c-.46.45-1.06.68-1.66.68s-1.2-.23-1.65-.68l-7.1-7.08c-.44-.44-.68-1.03-.68-1.66 0-.62.24-1.21.68-1.65l4.31-4.3c-.2.19-.2.51 0 .7l.36.36-3.96 3.95c-.25.25-.39.58-.39.94s.14.7.39.95l7.09 7.08c.52.52 1.38.52 1.9 0l3.95-3.94.35.35c.09.1.22.15.35.15s.26-.05.35-.15z" />
                  </g>
                </svg>
              </div>
            </div>
            {/* Item */}
            <div class="hover:bg-white hover:text-black transition-all duration-200 flex flex-row justify-between">
              {/* Track Info */}
              <div class="mx-4 py-2 flex flex-col justify-between flex-grow">
                <p class="text-xl text-red-600">Track name</p>
                <p>Track artist</p>
                <p>Listeners: 1</p>
              </div>
              {/* Remove button */}
              <div class="flex-shrink-0 mx-4 w-12 my-auto">
                <svg
                  class="cursor-pointer hover:text-red-600"
                  x="0"
                  y="0"
                  viewBox="-2 -2 30 30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g class="stroke-current stroke-1">
                    <path d="m14.66 19.02-.35-.35.7-.7.35.35c.2.19.2.51 0 .7-.09.1-.22.15-.35.15s-.26-.05-.35-.15z" />
                    <path
                      d="m9.675 7.48h.99v12.7h-.99z"
                      transform="matrix(.707 -.707 .707 .707 -6.801 11.242)"
                    />
                    <path d="m22.63 8.47-7.09-7.08c-.53-.52-1.38-.52-1.9 0l-7.61 7.6-.36-.36c-.19-.2-.51-.2-.7 0l7.96-7.95c.91-.91 2.4-.91 3.31 0l7.1 7.08c.44.44.68 1.03.68 1.66 0 .62-.24 1.21-.68 1.65l-7.97 7.96-.01-.01c.2-.19.2-.51 0-.7l-.35-.35 7.62-7.61c.25-.25.39-.58.39-.94s-.14-.7-.39-.95z" />
                    <path d="m6.03 8.99-.7.7-.36-.36c-.2-.19-.2-.51 0-.7.19-.2.51-.2.7 0z" />
                    <path d="m15.37 19.03-4.3 4.29c-.46.45-1.06.68-1.66.68s-1.2-.23-1.65-.68l-7.1-7.08c-.44-.44-.68-1.03-.68-1.66 0-.62.24-1.21.68-1.65l4.31-4.3c-.2.19-.2.51 0 .7l.36.36-3.96 3.95c-.25.25-.39.58-.39.94s.14.7.39.95l7.09 7.08c.52.52 1.38.52 1.9 0l3.95-3.94.35.35c.09.1.22.15.35.15s.26-.05.35-.15z" />
                  </g>
                </svg>
              </div>
            </div>
            {/* Item */}
            <div class="hover:bg-white hover:text-black transition-all duration-200 flex flex-row justify-between">
              {/* Track Info */}
              <div class="mx-4 py-2 flex flex-col justify-between flex-grow">
                <p class="text-xl text-red-600">Track name</p>
                <p>Track artist</p>
                <p>Listeners: 1</p>
              </div>
              {/* Remove button */}
              <div class="flex-shrink-0 mx-4 w-12 my-auto">
                <svg
                  class="cursor-pointer hover:text-red-600"
                  x="0"
                  y="0"
                  viewBox="-2 -2 30 30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g class="stroke-current stroke-1">
                    <path d="m14.66 19.02-.35-.35.7-.7.35.35c.2.19.2.51 0 .7-.09.1-.22.15-.35.15s-.26-.05-.35-.15z" />
                    <path
                      d="m9.675 7.48h.99v12.7h-.99z"
                      transform="matrix(.707 -.707 .707 .707 -6.801 11.242)"
                    />
                    <path d="m22.63 8.47-7.09-7.08c-.53-.52-1.38-.52-1.9 0l-7.61 7.6-.36-.36c-.19-.2-.51-.2-.7 0l7.96-7.95c.91-.91 2.4-.91 3.31 0l7.1 7.08c.44.44.68 1.03.68 1.66 0 .62-.24 1.21-.68 1.65l-7.97 7.96-.01-.01c.2-.19.2-.51 0-.7l-.35-.35 7.62-7.61c.25-.25.39-.58.39-.94s-.14-.7-.39-.95z" />
                    <path d="m6.03 8.99-.7.7-.36-.36c-.2-.19-.2-.51 0-.7.19-.2.51-.2.7 0z" />
                    <path d="m15.37 19.03-4.3 4.29c-.46.45-1.06.68-1.66.68s-1.2-.23-1.65-.68l-7.1-7.08c-.44-.44-.68-1.03-.68-1.66 0-.62.24-1.21.68-1.65l4.31-4.3c-.2.19-.2.51 0 .7l.36.36-3.96 3.95c-.25.25-.39.58-.39.94s.14.7.39.95l7.09 7.08c.52.52 1.38.52 1.9 0l3.95-3.94.35.35c.09.1.22.15.35.15s.26-.05.35-.15z" />
                  </g>
                </svg>
              </div>
            </div>
            {/* Item */}
            <div class="hover:bg-white hover:text-black transition-all duration-200 flex flex-row justify-between">
              {/* Track Info */}
              <div class="mx-4 py-2 flex flex-col justify-between flex-grow">
                <p class="text-xl text-red-600">Track name</p>
                <p>Track artist</p>
                <p>Listeners: 1</p>
              </div>
              {/* Remove button */}
              <div class="flex-shrink-0 mx-4 w-12 my-auto">
                <svg
                  class="cursor-pointer hover:text-red-600"
                  x="0"
                  y="0"
                  viewBox="-2 -2 30 30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g class="stroke-current stroke-1">
                    <path d="m14.66 19.02-.35-.35.7-.7.35.35c.2.19.2.51 0 .7-.09.1-.22.15-.35.15s-.26-.05-.35-.15z" />
                    <path
                      d="m9.675 7.48h.99v12.7h-.99z"
                      transform="matrix(.707 -.707 .707 .707 -6.801 11.242)"
                    />
                    <path d="m22.63 8.47-7.09-7.08c-.53-.52-1.38-.52-1.9 0l-7.61 7.6-.36-.36c-.19-.2-.51-.2-.7 0l7.96-7.95c.91-.91 2.4-.91 3.31 0l7.1 7.08c.44.44.68 1.03.68 1.66 0 .62-.24 1.21-.68 1.65l-7.97 7.96-.01-.01c.2-.19.2-.51 0-.7l-.35-.35 7.62-7.61c.25-.25.39-.58.39-.94s-.14-.7-.39-.95z" />
                    <path d="m6.03 8.99-.7.7-.36-.36c-.2-.19-.2-.51 0-.7.19-.2.51-.2.7 0z" />
                    <path d="m15.37 19.03-4.3 4.29c-.46.45-1.06.68-1.66.68s-1.2-.23-1.65-.68l-7.1-7.08c-.44-.44-.68-1.03-.68-1.66 0-.62.24-1.21.68-1.65l4.31-4.3c-.2.19-.2.51 0 .7l.36.36-3.96 3.95c-.25.25-.39.58-.39.94s.14.7.39.95l7.09 7.08c.52.52 1.38.52 1.9 0l3.95-3.94.35.35c.09.1.22.15.35.15s.26-.05.35-.15z" />
                  </g>
                </svg>
              </div>
            </div>
            {/* Item */}
            <div class="hover:bg-white hover:text-black transition-all duration-200 flex flex-row justify-between">
              {/* Track Info */}
              <div class="mx-4 py-2 flex flex-col justify-between flex-grow">
                <p class="text-xl text-red-600">Track name</p>
                <p>Track artist</p>
                <p>Listeners: 1</p>
              </div>
              {/* Remove button */}
              <div class="flex-shrink-0 mx-4 w-12 my-auto">
                <svg
                  class="cursor-pointer hover:text-red-600"
                  x="0"
                  y="0"
                  viewBox="-2 -2 30 30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g class="stroke-current stroke-1">
                    <path d="m14.66 19.02-.35-.35.7-.7.35.35c.2.19.2.51 0 .7-.09.1-.22.15-.35.15s-.26-.05-.35-.15z" />
                    <path
                      d="m9.675 7.48h.99v12.7h-.99z"
                      transform="matrix(.707 -.707 .707 .707 -6.801 11.242)"
                    />
                    <path d="m22.63 8.47-7.09-7.08c-.53-.52-1.38-.52-1.9 0l-7.61 7.6-.36-.36c-.19-.2-.51-.2-.7 0l7.96-7.95c.91-.91 2.4-.91 3.31 0l7.1 7.08c.44.44.68 1.03.68 1.66 0 .62-.24 1.21-.68 1.65l-7.97 7.96-.01-.01c.2-.19.2-.51 0-.7l-.35-.35 7.62-7.61c.25-.25.39-.58.39-.94s-.14-.7-.39-.95z" />
                    <path d="m6.03 8.99-.7.7-.36-.36c-.2-.19-.2-.51 0-.7.19-.2.51-.2.7 0z" />
                    <path d="m15.37 19.03-4.3 4.29c-.46.45-1.06.68-1.66.68s-1.2-.23-1.65-.68l-7.1-7.08c-.44-.44-.68-1.03-.68-1.66 0-.62.24-1.21.68-1.65l4.31-4.3c-.2.19-.2.51 0 .7l.36.36-3.96 3.95c-.25.25-.39.58-.39.94s.14.7.39.95l7.09 7.08c.52.52 1.38.52 1.9 0l3.95-3.94.35.35c.09.1.22.15.35.15s.26-.05.35-.15z" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
