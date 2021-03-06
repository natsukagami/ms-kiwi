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
    ws.addEventListener("close", () => setWs(newWs()), { once: true });
  }, [ws]);

  /// Rendering here
  return (
    <div class="mx-auto md:max-w-screen-md max-w-full px-4 pt-4 h-screen font-sans antialiased">
      <div class="w-full h-full flex flex-col">
        {/* Search bar */}
        <Search ws={ws} />
        {/* Currently playing */}
        <NowPlaying ws={ws} host={host} />
      </div>
    </div>
  );
}

export default App;
