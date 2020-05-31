import { h } from "preact";
import { Selector } from "./server/ws";
import { useState } from "preact/hooks";

/**
 * The search bar.
 * @param query The "call a query" function.
 */
export default function Search({
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
