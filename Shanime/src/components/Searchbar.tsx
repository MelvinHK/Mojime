import { getAnimeSearch } from "../utils/api";
import { useState, useEffect, useRef } from "react";
import { IAnimeResult, ISearch } from "@consumet/extensions";

function Searchbar() {
  const [query, setQuery] = useState<string>("");

  const [resultsList, setResultsList] = useState<IAnimeResult[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(false);

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const [resultsCache, setResultsCache] = useState<ISearch<IAnimeResult>[]>([]);

  const searchbarRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);
  const pageButtonsRef = useRef<HTMLDivElement>(null);

  // Need to differentiate for a new search
  const handleSearch = async (page: number) => {
    if (resultsCache[page - 1]) {
      const cached = resultsCache[page - 1];

      setResultsList(cached.results
        .filter(result => result.subOrDub === "sub")
      );
      setCurrentPage(cached.currentPage as number);
      setHasNextPage(cached.hasNextPage);

    } else try {
      const search = await getAnimeSearch(query, page);
      const results = search?.results
        .filter(result => result.subOrDub === "sub")

      setResultsList(results);
      setCurrentPage(search.currentPage as number);
      setHasNextPage(search.hasNextPage);

      if (!resultsCache[page - 1])
        setResultsCache([...resultsCache, search])

    } catch (error) {
      alert("Error: Unable to fetch results... Try again later.")
    }
  }

  // Search results' up/down-key selection.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!resultsList || e.key === 'Tab')
        return setSelectedIndex(-1);

      const total = resultsList.length;
      let index = selectedIndex;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          index = (index - 1 + total + 1) % (total + 1);
          searchbarRef?.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          index = (index + 1) % (total + 1);
          searchbarRef?.current?.focus();
          break;
        case 'Enter':
          if (selectedIndex != -1 && selectedIndex < total) {
            e.preventDefault();
            console.log(resultsList[index].id);
          }
          break;
      }

      setSelectedIndex(index);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resultsList, selectedIndex])

  useEffect(() => {
    if (!resultsList) return;

    if (selectedIndex >= 0 && selectedIndex < resultsList.length - 1)
      resultsRef.current?.children[selectedIndex].scrollIntoView(false);

    else if (selectedIndex === resultsList.length - 1)
      pageButtonsRef.current?.scrollIntoView();

  }, [selectedIndex])

  useEffect(() => {
    setSelectedIndex(-1);
    searchbarRef?.current?.focus();
  }, [query, resultsList])

  return (
    <div className="wrapper">
      <form spellCheck='false' onSubmit={(e) => (
        e.preventDefault(),
        handleSearch(currentPage)
      )}>
        <input
          ref={searchbarRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search'
          autoFocus
        />
      </form>
      {resultsList && <>
        <ul
          id='search-results'
          ref={resultsRef}
        >
          {resultsList.length !== 0 ?
            resultsList.map((result, index) =>
              <Result
                key={result.id}
                result={result}
                isSelected={index === selectedIndex}
              />
            ) :
            <li>
              No results
            </li>
          }
        </ul>
        <div
          id="page-nav"
          className="relative flex fl-end"
          ref={pageButtonsRef}
        >
          {currentPage > 1 &&
            <button
              className="mr-auto"
              onClick={() => (
                handleSearch(currentPage - 1)
              )}>
              Prev Page
            </button>
          }
          {hasNextPage &&
            <button
              onClick={() => (
                handleSearch(currentPage + 1)
              )}
            >
              Next Page
            </button>
          }
        </div>
      </>}
    </div >
  )
}

function Result({ result, isSelected }: { result: IAnimeResult, isSelected: boolean }) {
  return (
    <li
      className={isSelected ? 'selected' : ''}
      onClick={() => console.log(result.id)}
    >
      {typeof result.title === 'string' ?
        result.title :
        result.title.romaji || result.title.english}
    </li>
  )
}

export default Searchbar