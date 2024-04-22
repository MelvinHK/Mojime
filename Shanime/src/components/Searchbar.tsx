import { getAnimeSearch } from "../utils/api";
import { useState } from "react";
import { IAnimeResult } from "@consumet/extensions";

function Searchbar() {
  const [query, setQuery] = useState("");
  const [resultsList, setResultsList] = useState<IAnimeResult[]>();

  const handleSubmit = async () => {
    const results = await getAnimeSearch(query, 1);

    setResultsList(
      results?.results
        .filter(result => result.subOrDub === "sub")
    );
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
      </form>
      {resultsList &&
        <ul id='search-results'>
          {resultsList.map(result =>
            <li key={result.id}>
              {result.title as string}
            </li>
          )}
          {resultsList.length === 0 &&
            <li className="col-gray">
              No results
            </li>
          }
        </ul>
      }
    </>
  )
}

export default Searchbar