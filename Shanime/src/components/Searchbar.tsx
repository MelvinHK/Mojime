import { getAnimeSearch } from "../utils/api";
import { useState } from "react";
import { IAnimeResult } from "@consumet/extensions";

function Searchbar() {
  const [query, setQuery] = useState("");
  const [resultsList, setResultsList] = useState<IAnimeResult[]>();

  const handleSubmit = async () => {
    const results = await getAnimeSearch(query, 1);

    console.log(results?.results);
    setResultsList(results?.results);
  }

  return (
    <>
      <form spellCheck='false' onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
        <input
          className={`${resultsList ? `flat-bottom-br` : ``}`}
          placeholder='Search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {resultsList && <div className="relative w-100">
          <ul id='search-results'>
            {resultsList.map(result =>
              <li key={result.id}>
                {result.title as string}
              </li>
            )}
          </ul>
        </div>}
      </form>

    </>
  )
}

export default Searchbar