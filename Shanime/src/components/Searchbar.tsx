import { getSearch } from "../utils/provider";
import { useState, useEffect, useRef } from "react";
import { IAnimeResult, ISearch } from "@consumet/extensions";
import useClickAway from "../utils/hooks/useClickAway";
import { useNavigate } from "react-router-dom";

function Searchbar() {
  const [searchBarQuery, setSearchbarQuery] = useState<string>("");

  const [resultsList, setResultsList] = useState<IAnimeResult[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(false);

  // Up/Down key search result selection.
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // 1a. Cache results for when navigating back & forth between result pages.
  const [searchCache, setSearchCache] = useState<ISearch<IAnimeResult>[]>([]);
  // 1b. Store initial searchbar query in case it is edited before page navigation.
  const [pageNavQuery, setPageNavQuery] = useState<string>("");

  const searchbarRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const searchContainer = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const navigate = useNavigate();

  useClickAway(searchContainer.current, () => {
    setShowDropdown(false);
  });

  const handleSearch = async (query: string, page: number) => {
    if (!query.trim()) { return };

    try {
      const search = await getSearch(query, page);
      updateSearchResults(search);

      // 2. Page === 1 implies a new search; remove existing cache.
      setSearchCache(page === 1 ? [search] : [...searchCache, search]);
      if (page === 1) { setPageNavQuery(searchBarQuery) };

    } catch (error) {
      alert("Error: Unable to fetch results... Try again later.")
    }
  }

  const handlePageButton = (page: number) => {
    if (searchCache[page - 1]) {
      // Funny hack; need to setTimeout possibly due to a race condition with useClickAway 
      // when the buttons become hidden upon reaching the first/last page.
      setTimeout(() => updateSearchResults(searchCache[page - 1]), 1);
    } else {
      handleSearch(pageNavQuery, page);
    }
  }

  const updateSearchResults = (search: ISearch<IAnimeResult>) => {
    const list = search.results
      .filter(result => result.subOrDub === "sub");

    setResultsList(list);
    setCurrentPage(search.currentPage as number);
    setHasNextPage(search.hasNextPage);
  }

  const resetStates = () => {
    setSearchbarQuery("");
    setResultsList(undefined);
    setCurrentPage(1);
    setHasNextPage(false);
    setSearchCache([]);
    setPageNavQuery("");
    setShowDropdown(false);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !showDropdown) {
        e.preventDefault();
        searchbarRef?.current?.focus();
        return;
      }

      if (e.key === 'Escape' && showDropdown) {
        setShowDropdown(false);
        searchbarRef?.current?.blur();
        return;
      }

      if (!resultsList) {
        return;
      }

      const total = resultsList.length;
      let index = selectedIndex;

      if (['ArrowUp', 'ArrowDown'].includes(e.key) && showDropdown) {
        e.preventDefault();
        searchbarRef?.current?.focus();
        index = e.key === 'ArrowUp' ? (index + total) % (total + 1) : (index + 1) % (total + 1);
        setSelectedIndex(index);
        return;
      }

      if (e.key === 'Enter' && resultsList.hasOwnProperty(selectedIndex)) {
        e.preventDefault();
        navigate(`/${resultsList[index].id}-episode-1`);
        resetStates();
        searchbarRef?.current?.blur();
        return;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resultsList, selectedIndex, showDropdown]);

  useEffect(() => {
    if (resultsList?.hasOwnProperty(selectedIndex)) {
      resultsRef.current?.children[selectedIndex]
        .scrollIntoView(selectedIndex === resultsList.length - 1);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!showDropdown && (!pageNavQuery.includes(searchBarQuery) || searchBarQuery.length === 0)) {
      resetStates();
    }
  }, [showDropdown]);

  return (
    <div
      id="searchbar"
      ref={searchContainer}
    >
      <form
        className='flex'
        spellCheck='false'
        autoComplete="off"
        onSubmit={(e) => (
          e.preventDefault(),
          handleSearch(searchBarQuery, 1)
        )}
      >
        <input
          className="w-100 b-box"
          ref={searchbarRef}
          value={searchBarQuery}
          onChange={(e) => (
            setSelectedIndex(-1),
            setSearchbarQuery(e.target.value),
            setShowDropdown(e.target.value.length > 0)
          )}
          placeholder='Search'
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setSelectedIndex(-1)}
        />
      </form>
      {resultsList && showDropdown && (
        <div id="dropdown">
          <div id="page-nav">
            {currentPage > 1 && (
              <button
                className="mr-auto"
                onClick={() => handlePageButton(currentPage - 1)}
              >
                &lt; Prev.
              </button>
            )}
            {(currentPage > 1 || hasNextPage) && (
              <div className="abs-center">
                {`\u{22B6}\u{22B0}\u{22C7}\u{22B1}\u{22B7}`}
              </div>
            )}
            {hasNextPage && (
              <button
                className="ml-auto"
                onClick={() => handlePageButton(currentPage + 1)}
              >
                Next &gt;
              </button>
            )}
          </div>
          <ul
            id='search-results'
            ref={resultsRef}
          >
            {resultsList.length !== 0 ?
              resultsList.map((result, index) =>
                <li
                  key={result.id}
                  className={selectedIndex === index ? 'selected' : ''}
                  onClick={() => (
                    navigate(`/${resultsList[index].id}-episode-1`),
                    resetStates()
                  )}
                >
                  {result.title as string}
                </li>
              ) :
              <li className="no-results">
                No results
              </li>
            }
          </ul>
          <button
            id="close-results"
            onClick={() => setShowDropdown(false)}
          >
            Close
          </button>
        </div>
      )}
    </div >
  );
}

export default Searchbar;