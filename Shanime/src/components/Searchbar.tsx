import { getAnimeSearch } from "../apiUtils";
import { useState } from "react";

function Searchbar() {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(getAnimeSearch(query));
  }

  return (
    <form spellCheck='false' onSubmit={(e) => handleSubmit(e)}>
      <input placeholder='Search' value={query} onChange={(e) => setQuery(e.target.value)} />
    </form>
  )
}

export default Searchbar