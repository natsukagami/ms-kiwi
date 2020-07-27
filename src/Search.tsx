import { h } from "preact";
import WS, { Selector, Op, Message } from "./server/ws";
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
      if (m.op !== Op.ClientRequestTrack) return;
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
    <div class="flex-grow-0 h-32 overflow-x-hidden">
      <div class="z-20 relative">
        <SearchBar query={query} />
      </div>
      <div class="z-auto relative block">{status && <SearchStatus {...status} />}</div>
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
    <form class="bg-transparent text-white flex flex-row mt-1 leading-6" onSubmit={onSubmit}>
      {selectors.map((s, index) => (
        <SelectBtn
          selected={sel === Selector[s]}
          set={() => setSel(Selector[s])}
          text={s}
          class={index === 0 ? "rounded-l" : ""}
        />
      ))}
      <input
        class="outline-none border-white rounded-r hover:rounded-none border hover:border-t-transparent hover:border-r-transparent w-full bg-transparent px-8 hover:px-2 hover:mr-6 transition-all ease-in-out duration-200"
        placeholder="Search"
        value={value}
        onChange={(e) => setValue((e.target as HTMLInputElement).value)}
      />
    </form>
  );
}

type SearchStatusProps =
  | {
      success: boolean;
      reason: string;
      data: {
        track?: TrackMetadata;
      };
    }
  | { query: string };

/**
 * Search status bar.
 */
function SearchStatus(props: SearchStatusProps) {
  return (
    <div class="w-9/12 mx-auto py-5 pb-5 pt-2 rounded-b bg-blue text-white animate__animated animate__slideInDown">
      {"query" in props ? (
        // Query in progress
        <div>
          <p class="px-2 text-xl">Querying...</p>
          <p class="px-2">{props.query}</p>
        </div>
      ) : props.success ? (
        // Succeeded!
        <div>
          <p class="px-2 text-green text-xl">Track added!</p>
          <p class="px-2">
            {props.data.track!.artist} - {props.data.track!.title}
          </p>
        </div>
      ) : (
        // Failed
        <div>
          <p class="px-2 text-red text-xl">Query failed</p>
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
  const selectedClass = selected ? "bg-white text-blue" : "";
  return (
    <div
      {...rest}
      class={`flex-shrink-0 hover:bg-white border-white border py-2 w-12 cursor-pointer text-center hover:text-blue ${selectedClass} ${rest.class}`}
      onClick={set}
    >
      {text}
    </div>
  );
}
