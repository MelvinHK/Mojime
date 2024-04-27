import { getAnimeSearch } from "../utils/api";
import { useState, useEffect, useRef } from "react";
import { IAnimeResult, ISearch } from "@consumet/extensions";

function Searchbar() {
  const [searchBarQuery, setSearchbarQuery] = useState<string>("");

  const [resultsList, setResultsList] = useState<IAnimeResult[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(false);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);

  // For when using the up/down key to select search results.
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // 1a. Cache results for when navigating back & forth between results with pages.
  const [searchCache, setSearchCache] = useState<ISearch<IAnimeResult>[]>([]);
  // 1b. Store initial searchbar query in case it is edited before page navigation.
  const [pageNavQuery, setPageNavQuery] = useState<string>("");

  const searchbarRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const handleSearch = async (query: string, page: number) => {
    try {
      const search = await getAnimeSearch(query, page);
      updateSearchResults(search);

      // 2. Page === 1 implies a new search; remove existing cache
      setSearchCache(page === 1 ? [search] : [...searchCache, search]);
      if (page === 1) setPageNavQuery(searchBarQuery);

    } catch (error) {
      alert("Error: Unable to fetch results... Try again later.")
    }
  }

  const handlePageButton = (page: number) => {
    if (searchCache[page - 1]) {
      updateSearchResults(searchCache[page - 1]);
    } else {
      handleSearch(pageNavQuery, page);
    }
  }

  const updateSearchResults = (search: ISearch<IAnimeResult>) => {
    const list = search.results
      .filter(result => result.subOrDub === "sub"); // There exists an edge case where if the list has no "sub" anime, no results will show. 

    setResultsList(list);
    setCurrentPage(search.currentPage as number);
    setHasNextPage(search.hasNextPage);
  }

  // Search results' up/down-key selection.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!resultsList || e.key === 'Tab')
        return setSelectedIndex(-1);

      const total = resultsList.length;
      let index = selectedIndex;

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        searchbarRef?.current?.focus();

        index = e.key === 'ArrowUp' ?
          (index - 1 + total + 1) % (total + 1) :
          (index + 1) % (total + 1);

      } else if (e.key === 'Enter' && resultsList.hasOwnProperty(selectedIndex)) {
        e.preventDefault();
        console.log(resultsList[index].id);
      }

      setSelectedIndex(index);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resultsList, selectedIndex])

  useEffect(() => {
    if (resultsList?.hasOwnProperty(selectedIndex))
      resultsRef.current?.children[selectedIndex].scrollIntoView(false);
  }, [selectedIndex])

  useEffect(() => {
    setSelectedIndex(-1);
  }, [resultsList])

  return (
    <div className='wrapper w-100'>
      <form
        className='flex'
        spellCheck='false'
        onSubmit={(e) => (
          e.preventDefault(),
          handleSearch(searchBarQuery, 1)
        )}>
        <input
          className="w-100 b-box"
          ref={searchbarRef}
          value={searchBarQuery}
          onChange={(e) => (
            setSelectedIndex(-1),
            setSearchbarQuery(e.target.value)
          )}
          placeholder='Search'
          autoFocus
        />
      </form>
      {(currentPage > 1 || hasNextPage) &&
        <div id="page-nav">
          {currentPage > 1 &&
            <button
              className="mr-auto"
              onClick={() => (
                handlePageButton(currentPage - 1)
              )}>
              {`\u{2190}`} Prev.
            </button>
          }
          <div className="abs-center">
            ⊶⊰⋇⊱⊷
          </div>
          {hasNextPage &&
            <button
              className="ml-auto"
              onClick={() => (
                handlePageButton(currentPage + 1)
              )}
            >
              Next {`\u{2192}`}
            </button>
          }
        </div>
      }
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
            <li id="no-results">
              No results
            </li>
          }
        </ul>
      </>}
    </div >
  );
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
  );
}

export default Searchbar;