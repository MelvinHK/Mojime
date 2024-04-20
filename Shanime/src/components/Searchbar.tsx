import { getAnimeSearch } from "../utils/api";
import { useState } from "react";

function Searchbar() {
  const [query, setQuery] = useState("");

  const handleSubmit = async () => {
    console.log(getAnimeSearch(query));
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