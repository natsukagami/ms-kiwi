import { h } from "preact";
import { useState } from "preact/hooks";
import WS from "./server/ws";

/**
 * Main app.
 *
 * @param host The server host URL.
 */
function App({ host }: { host: string }) {
  /// The websocket connection.
  const [ws] = useState(new WS(`${host.replace(/^http/, "ws")}/status`));

  return <div>UWU</div>;
}

export default App;
