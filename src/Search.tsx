import { h } from "preact";
import { Selector } from "./server/ws";
import { useState, useEffect } from "preact/hooks";

/**
 * The search interface.
 */
export default function Search({
  query,
}: {
  query: (query: string, selector: Selector) => void;
}) {
  return (
    <div>
      <div class="z-10 relative">
        <SearchBar query={query} />
      </div>
      <div class="z-0 relative">
        <SearchStatus />
      </div>
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

/**
 * Search status bar.
 */
function SearchStatus({}: {}) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setTimeout(() => setShow(false), 2000);
  });

  return (
    <div class="w-9/12 mx-auto transition-all duration-200">
      <div
        class={`pb-4 pt-2 rounded-b-lg bg-blue-900 text-white animate__animated ${
          show ? "animate__slideInDown" : "animate__slideOutUp"
        }`}
      >
        <p class="px-2 text-xl">Querying...</p>
        <p class="px-2">Query string</p>
      </div>
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
