import { h } from "preact";
import WS, { Selector, OpClientRequestTrack, Message } from "./server/ws";
import { useState, useEffect } from "preact/hooks";
import TrackMetadata from "./server/track";

/**
 * The search interface.
 */
export default function Search({ ws }: { ws: WS }) {
  /// State: status of the search
  const [status, setStatus] = useState<SearchStatusProps | null>(null);
  /// Effect: search status messages's listener
  useEffect(() => {
    const fn = (m: Message) => {
      if (m.op !== OpClientRequestTrack) return;
      setStatus(m);
      setTimeout(() => setStatus((prev) => (prev === m ? null : prev)), 3000);
    };
    return ws.addMessageHandler(fn);
  }, [ws]);
  // Effect: "send query" binder
  const query = (query: string, s: Selector) => {
    setStatus({ query });
    return ws.requestTrack(query, s);
  };

  return (
    <div>
      <div class="z-10 relative">
        <SearchBar query={query} />
      </div>
      <div class="z-0 relative">{status && <SearchStatus {...status} />}</div>
    </div>
  );
}

/**
 * The search bar.
 * @param query The "call a query" function.
 */
function SearchBar({
  query,
}: {
  query: (query: string, selector: Selector) => void;
}) {
  /// The current query value.
  const [value, setValue] = useState("");
  /// The current selector.
  const [sel, setSel] = useState<Selector>(Selector.DZ);

  /// On-submit handler
  const onSubmit = (e: Event) => {
    e.preventDefault();
    if (value !== "") {
      query(value, sel);
      setValue("");
    }
  };

  /// Rendering!!
  const selectors = Object.values(Selector).filter(
    (v) => typeof v === "string"
  ) as (keyof typeof Selector)[];

  return (
    <form class="bg-transparent text-white flex flex-row" onSubmit={onSubmit}>
      {selectors.map((s, index) => (
        <SelectBtn
          selected={sel === Selector[s]}
          set={() => setSel(Selector[s])}
          text={s}
          class={index === 0 ? "rounded-l-lg" : ""}
        />
      ))}
      <input
        class="outline-none border-white rounded-r-lg hover:rounded-none focus:rounded-none border hover:border-t-0 hover:border-r-0 focus:border-t-0 focus:border-r-0 w-full bg-transparent px-8 hover:px-2 focus:px-2 hover:mr-6 focus:mr-6 transition-all duration-100"
        placeholder="Search"
        value={value}
        onChange={(e) => setValue((e.target as HTMLInputElement).value)}
      />
    </form>
  );
}

type SearchStatusProps =
  | {
      success: false;
      reason: string;
    }
  | {
      success: true;
      track: TrackMetadata;
    }
  | { query: string };

/**
 * Search status bar.
 */
function SearchStatus(props: SearchStatusProps) {
  return (
    <div class="w-9/12 mx-auto pb-4 pt-2 rounded-b-lg bg-blue-900 text-white animate__animated animate__slideInDown">
      {"query" in props ? (
        // Query in progress
        <div>
          <p class="px-2 text-xl">Querying...</p>
          <p class="px-2">{props.query}</p>
        </div>
      ) : props.success ? (
        // Succeeded!
        <div>
          <p class="px-2 text-green-400 text-xl">Track added!</p>
          <p class="px-2">
            {props.track.artist} - {props.track.title}
          </p>
        </div>
      ) : (
        // Failed
        <div>
          <p class="px-2 text-red-600 text-xl">Query failed</p>
          <p class="px-2">{props.reason}</p>
        </div>
      )}
    </div>
  );
}

/**
 * A selector button.
 * @param selected  Whether the selector is currently selected.
 * @param set       The "set to this selector" function.
 * @param text      The selector's name.
 */
function SelectBtn({
  selected,
  set,
  text,
  ...rest
}: {
  selected: boolean;
  set: () => void;
  text: string;
} & h.JSX.HTMLAttributes<HTMLDivElement>) {
  const selectedClass = selected ? "bg-white text-black" : "";
  return (
    <div
      {...rest}
      class={`flex-shrink-0 hover:bg-white border-white border py-2 w-12 cursor-pointer text-center hover:text-black ${selectedClass} ${rest.class}`}
      onClick={set}
    >
      {text}
    </div>
  );
}
