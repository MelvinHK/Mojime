import { getAnimeSearch } from "../utils/api";
import { useState } from "react";

function Searchbar() {
  const [query, setQuery] = useState("");

  const handleSubmit = async () => {
    const results = await getAnimeSearch(query);
    console.log(results);
  }

  return (
    <form spellCheck='false' onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}>
      <input placeholder='Search'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
    </form>
  )
}

export default Searchbar