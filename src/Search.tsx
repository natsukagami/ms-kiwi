import { h } from "preact";
import WS, { MusicSourceInfo, Op, Message } from "./server/ws";
import { useState, useEffect } from "preact/hooks";
import TrackMetadata from "./server/track";

/**
 * The search interface.
 */
export default function Search({ ws }: { ws: WS }) {
  /// State: status of the search
  const [status, setStatus] = useState<SearchStatusProps | null>(null);
  /// State: sources list
  const [sources, setSources] = useState<MusicSourceInfo[]>([]);
  /// Effect: search status messages's listener
  useEffect(() => {
    const fn = (m: Message) => {
      switch (m.op) {
        case Op.ClientRequestTrack:
          setStatus(m);
          setTimeout(() => setStatus((prev) => (prev === m ? null : prev)), 3000);
          break;
        case Op.ListSources:
          setSources(m.data.sources!);
          break;
        default:
          break;
      }
    };
    ws.readyState === ws.OPEN && ws.getSourcesList();
    return ws.addMessageHandler(fn);
  }, [ws]);
  // Effect: "send query" binder
  const query = (query: string, s: number) => {
    setStatus({ query });
    return ws.requestTrack(query, s);
  };
  if (sources.length <= 0) return null;
  return (
    <div class="flex-grow-0 h-40 overflow-x-hidden flex-shrink-0">
      <div class="z-20 relative">
        <SearchBar query={query} sources={sources} />
      </div>
      <div class="z-auto relative block">
        {status && <SearchStatus {...status} />}
      </div>
    </div>
  );
}

/**
 * The search bar.
 * @param query The "call a query" function.
 */
function SearchBar({
  sources,
  query,
}: {
  sources: MusicSourceInfo[];
  query: (query: string, selector: number) => void;
}) {
  /// The current query value.
  const [value, setValue] = useState("");
  /// The current selector.
  const [sel, setSel] = useState<number>(() => {
    let _ = localStorage.getItem("src-selector");
    return _ && (+_ >= 0 && +_ < sources.length) && +_ || 0;
  });

  /// On-submit handler
  const onSubmit = (e: Event) => {
    e.preventDefault();
    if (value !== "") {
      query(value, sel);
      setValue("");
    }
  };

  return (
    <form
      class="bg-transparent text-white flex flex-row mt-1 leading-6"
      onSubmit={onSubmit}
    >
      {sources.map((s, index) => (
        <SelectBtn
          selected={sel === s.id}
          set={() => {
            localStorage.setItem("src-selector", s.id.toString())
            setSel(s.id)
          }}
          text={s.display_name}
          class={index === 0 ? "rounded-l-15" : ""}
        />
      ))}
      <input
        class="outline-none border-white rounded-r-15 border w-full bg-transparent px-8 hovers:hover:px-2 transition-all ease-in-out duration-200 hovers:hover:mr-6 hovers:hover:rounded-none hovers:hover:border-t-transparent hovers:hover:border-r-transparent notplaceholder:rounded-none notplaceholder:mr-6 notplaceholder:border-t-transparent notplaceholder:border-r-transparent notplaceholder:px-2"
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
    <div class="w-9/12 mx-auto pb-5 pt-2 rounded-b-15 bg-blue bg-opacity-50 text-white animate__animated animate__slideInDown">
      {"query" in props ? (
        // Query in progress
        <div>
          <p class="px-2 text-xl">Querying...</p>
          <p class="px-2 truncate">{props.query}</p>
        </div>
      ) : props.success ? (
        // Succeeded!
        <div>
          <p class="px-2 text-green text-xl">Track added!</p>
          <p class="px-2 text-lg text-secondary truncate">{props.data.track!.title}</p>
          <p class="px-2 truncate">{props.data.track!.artists}</p>
        </div>
      ) : (
            // Failed
            <div>
              <p class="px-2 text-red text-xl">Query failed</p>
              <p class="px-2 truncate">{props.reason}</p>
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
  const selectedClass = selected ? "bg-white text-teritary" : "";
  return (
    <div
      {...rest}
      class={`flex-shrink-0 hovers:hover:bg-white border-white border py-2 w-12 cursor-pointer text-center hovers:hover:text-blue .leading-4 ${selectedClass} ${rest.class}`}
      onClick={set}
    >
      {text}
    </div>
  );
}
