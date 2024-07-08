import { getSearch } from "../utils/api";
import { useState, useEffect, useRef, useMemo } from "react";
import { IAnimeResult, ISearch } from "@consumet/extensions";
import useClickAway from "../utils/hooks/useClickAway";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";

export default function Searchbar() {
  const [searchBarQuery, setSearchbarQuery] = useState<string>("");
  const [subOrDubOption, setSubOrDubOption] = useState<"sub" | "dub">("sub");

  const [resultsList, setResultsList] = useState<IAnimeResult[]>();
  const filteredResults = useMemo(() =>
    resultsList?.filter(result => result.subOrDub === subOrDubOption),
    [resultsList, subOrDubOption]
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    if (!query.trim()) { return; }

    setIsLoading(true);
    try {
      const search = await getSearch(query, page);
      updateSearchResults(search);
      // 2. Page === 1 implies a new search; remove existing cache.
      setSearchCache(page === 1 ? [search] : [...searchCache, search]);
      if (page === 1) { setPageNavQuery(searchBarQuery); }
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
  }

  const handlePageButton = (page: number) => {
    if (isLoading) { return; }

    if (searchCache[page - 1]) {
      updateSearchResults(searchCache[page - 1]);
    } else {
      handleSearch(pageNavQuery, page);
    }
  }

  const updateSearchResults = (search: ISearch<IAnimeResult>) => {
    setResultsList(search.results);
    setCurrentPage(search.currentPage as number);
    setHasNextPage(search.hasNextPage);
    setShowDropdown(true);
  }

  const resetSearchbar = () => {
    setSearchbarQuery("");
    setResultsList(undefined);
    setCurrentPage(1);
    setHasNextPage(false);
    setSearchCache([]);
    setPageNavQuery("");
    setShowDropdown(false);
  }

  const handleNavigate = (index: number) => {
    if (filteredResults) {
      setSearchbarQuery(filteredResults[index].title as string);
      setShowDropdown(false);
      navigate(`/${filteredResults[index].id}/1`);
      searchbarRef?.current?.blur();
    }
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

      if (!filteredResults) {
        return;
      }

      if (['ArrowUp', 'ArrowDown'].includes(e.key) && showDropdown) {
        e.preventDefault();
        searchbarRef?.current?.focus();
        setSelectedIndex(
          e.key === 'ArrowUp' ?
            (selectedIndex + filteredResults.length) % (filteredResults.length + 1)
            :
            (selectedIndex + 1) % (filteredResults.length + 1)
        );
        return;
      }

      if (e.key === 'Enter' && filteredResults.hasOwnProperty(selectedIndex)) {
        e.preventDefault();
        handleNavigate(selectedIndex);
        return;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredResults, selectedIndex, showDropdown]);

  useEffect(() => {
    if (filteredResults?.hasOwnProperty(selectedIndex)) {
      resultsRef.current?.children[selectedIndex]
        .scrollIntoView(selectedIndex === filteredResults.length - 1);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (searchBarQuery.length === 0) {
      resetSearchbar();
    }
  }, [searchBarQuery]);

  return (
    <div
      id="searchbar"
      ref={searchContainer}
    >
      {/******** INPUT ********/}
      <form
        className='flex fl-a-center'
        spellCheck='false'
        autoComplete="off"
        onSubmit={(e) => (
          e.preventDefault(),
          handleSearch(searchBarQuery, 1)
        )}
      >
        <input
          className="w-100"
          ref={searchbarRef}
          value={searchBarQuery}
          onChange={(e) => (
            setSelectedIndex(-1),
            setSearchbarQuery(e.target.value)
          )}
          placeholder='Search'
          onClick={() => setShowDropdown(true)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setSelectedIndex(-1)}
        />
        {isLoading && <LoadingAnimation />}
      </form>

      {/******** DROPDOWN ********/}
      {filteredResults && showDropdown && (
        <div id="dropdown">
          {/******** PAGE NAVIGATION ********/}
          <div id="page-nav">
            {/* SUB OR DUB TOGGLE */}
            <button
              onClick={() => setSubOrDubOption(subOrDubOption === "sub" ? "dub" : "sub")}
            >
              <span className={subOrDubOption !== "sub" ? "o-disabled" : ""}>
                Sub&nbsp;
              </span>
              /
              <span className={subOrDubOption !== "dub" ? "o-disabled" : ""}>
                &nbsp;Dub
              </span>
            </button>
            {/* NEXT & PREV BUTTONS */}
            {(hasNextPage || currentPage > 1) && (
              <div className="ml-auto">
                <button
                  onClick={() => handlePageButton(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt; Prev
                </button>
                <button
                  onClick={() => handlePageButton(currentPage + 1)}
                  disabled={!hasNextPage}
                >
                  Next &gt;
                </button>

              </div>
            )}
          </div>
          {/******** RESULTS ********/}
          <ul
            id='search-results'
            ref={resultsRef}
          >
            {filteredResults.length > 0 ? (
              filteredResults?.map((result, index) =>
                <li
                  key={result.id}
                  className={selectedIndex === index ? 'selected' : ''}
                  onClick={() => handleNavigate(index)}
                >
                  {result.title as string}
                </li>
              )
            ) : (
              <li className="no-results">
                No results
              </li>
            )}
          </ul>
          {/******** CLOSE BUTTON ********/}
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