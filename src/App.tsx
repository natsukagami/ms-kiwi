import { h } from "preact";
import { useState } from "preact/hooks";
import WS from "./server/ws";
import Search from "./Search";

/**
 * Main app.
 *
 * @param host The server host URL.
 */
function App({ host }: { host: string }) {
  /// The websocket connection.
  const newWs = () => new WS(`${host.replace(/^http/, "ws")}/status`);
  const [ws, setWs] = useState(newWs());
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
        <Search query={ws.requestTrack.bind(ws)} />
        {/* Currently playing */}
        <div class="rounded-lg p-4 bg-blue-900 flex flex-row">
          {/* Track Info */}
          <div class="flex flex-col justify-between flex-grow text-gray-400">
            <p class="text-xl text-red-600">Track name</p>
            <p>Track artist</p>
            <p>Listeners: 1</p>
          </div>
          {/* Play/Pause */}
          <div class="flex-shrink-0 w-16">
            <svg
              class="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              x="0px"
              y="0px"
              viewBox="0 0 250.488 250.488"
              xmlSpace="preserve"
            >
              <g
                class="stroke-current stroke-15 fill-bg text-gray-400 hover:text-red-600 stroke-2 cursor-pointer"
                transform="translate(75,65) scale(0.5)"
              >
                <path
                  style="fill-rule:evenodd;clip-rule:evenodd;"
                  d="M203.791,99.628L49.307,2.294c-4.567-2.719-10.238-2.266-14.521-2.266   c-17.132,0-17.056,13.227-17.056,16.578v198.94c0,2.833-0.075,16.579,17.056,16.579c4.283,0,9.955,0.451,14.521-2.267   l154.483-97.333c12.68-7.545,10.489-16.449,10.489-16.449S216.471,107.172,203.791,99.628z"
                />
              </g>
              {/* <g
                class="stroke-current stroke-15 fill-bg text-gray-400 hover:text-red-600 stroke-2 cursor-pointer"
                transform="translate(75,65) scale(0.5)"
              >
                <path
                  style="fill-rule:evenodd;clip-rule:evenodd;"
                  d="M80.543,0H35.797c-9.885,0-17.898,8.014-17.898,17.898v196.883   c0,9.885,8.013,17.898,17.898,17.898h44.746c9.885,0,17.898-8.013,17.898-17.898V17.898C98.44,8.014,90.427,0,80.543,0z M196.882,0   h-44.746c-9.886,0-17.899,8.014-17.899,17.898v196.883c0,9.885,8.013,17.898,17.899,17.898h44.746   c9.885,0,17.898-8.013,17.898-17.898V17.898C214.781,8.014,206.767,0,196.882,0z"
                />
              </g> */}
            </svg>
          </div>
          {/* Skip */}
          <div class="flex-shrink-0 w-16">
            <svg
              class="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              x="0px"
              y="0px"
              viewBox="0 0 250.488 250.488"
              xmlSpace="preserve"
            >
              <g
                class="stroke-current stroke-15 fill-bg text-gray-400 hover:text-red-600 stroke-2 cursor-pointer"
                transform="translate(65,65) scale(0.5)"
              >
                <path d="M242.381,110.693L140.415,24.591c-3.48-2.406-7.805-2.005-11.071-2.005   c-13.061,0-13.003,11.7-13.003,14.666v65.249l-92.265-77.91c-3.482-2.406-7.807-2.005-11.072-2.005   C-0.057,22.587,0,34.287,0,37.252v175.983c0,2.507-0.057,14.666,13.004,14.666c3.265,0,7.59,0.401,11.072-2.005l92.265-77.91   v65.249c0,2.507-0.058,14.666,13.003,14.666c3.266,0,7.591,0.401,11.071-2.005l101.966-86.101   c9.668-6.675,7.997-14.551,7.997-14.551S252.049,117.367,242.381,110.693z" />
              </g>
            </svg>
          </div>
        </div>
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
