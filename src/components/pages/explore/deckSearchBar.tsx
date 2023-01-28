import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function DeckSearchBar() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const onInput = () => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    // onInputFilter(quickSearchFilter, debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div
      className={
        "my-6 flex w-full min-w-[300px] justify-center rounded-2xl bg-main-400 p-1 shadow md:m-2 md:w-[30vw]"
      }
    >
      <input
        className={
          "w-full rounded-2xl p-1 text-center text-main-700 focus:outline-main-300"
        }
        type="text"
        placeholder="Search by deck name..."
        onChange={onInput()}
      />
    </div>
  );
}
