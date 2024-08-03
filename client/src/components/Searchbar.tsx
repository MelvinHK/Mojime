import { getSearch } from "../utils/api";
import { useState, useEffect, useRef, useContext } from "react";
import useClickAway from "../utils/hooks/useClickAway";
import { useNavigate } from "react-router-dom";
import { WatchContext } from "../contexts/WatchProvider";
import LoadingAnimation from "./LoadingAnimation";

type subOrDub = "sub" | "dub";

interface AnimeDetails {
  animeId: string;
  title: string;
  subOrDub: subOrDub;
  otherNames: string[];
}

export default function Searchbar() {
  const { setEpisodeNoState } = useContext(WatchContext);

  const [searchBarQuery, setSearchbarQuery] = useState<string>("");
  const [subOrDubOption, setSubOrDubOption] = useState<subOrDub>("sub");

  const [resultsList, setResultsList] = useState<AnimeDetails[]>();

  // Up/Down key search result selection.
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const searchbarRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const searchContainer = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const navigate = useNavigate();

  useClickAway(searchContainer.current, () => {
    setShowDropdown(false);
  });

  const updateSearchResults = (results: AnimeDetails[]) => {
    setResultsList(results);
    setShowDropdown(true);
  }

  const getSearchWithAbort = async (value: string, subOrDub: subOrDub) => {
    const newAbortController = new AbortController();
    abortControllerRef.current = newAbortController;

    try {
      return await getSearch(value, subOrDub, newAbortController.signal);
    } catch (error) {
      throw error;
    }
  }

  const abortPreviousRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }

  const handleAutoComplete = useRef(async (value: string, subOrDub: subOrDub) => {
    if (value.length <= 2) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await getSearchWithAbort(value, subOrDub);
      updateSearchResults(result);
      setIsLoading(false);
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        return;
      }
      setIsLoading(false);
    }
  }).current;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    abortPreviousRequest();

    setSelectedIndex(-1);
    setSearchbarQuery(e.target.value);

    setIsLoading(true);
    await handleAutoComplete(e.target.value, subOrDubOption);
  };

  const handleSubOrDubToggle = async () => {
    if (isLoading || searchBarQuery.length <= 2) { return; }

    setIsLoading(true);

    const option = subOrDubOption === "sub" ? "dub" : "sub";
    setSubOrDubOption(option);

    try {
      const results = await getSearchWithAbort(searchBarQuery, option);
      updateSearchResults(results);
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        return;
      }
    }

    setIsLoading(false);
  }

  const resetSearchbar = () => {
    setSearchbarQuery("");
    setResultsList(undefined);
    setShowDropdown(false);
  }

  const handleNavigate = (index: number) => {
    if (resultsList) {
      setSearchbarQuery(resultsList[index].title as string);
      setShowDropdown(false);
      navigate(`/${resultsList[index].animeId}/1`);
      setEpisodeNoState("1");
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

      if (!resultsList) {
        return;
      }

      if (['ArrowUp', 'ArrowDown'].includes(e.key) && showDropdown) {
        e.preventDefault();
        searchbarRef?.current?.focus();
        setSelectedIndex(
          e.key === 'ArrowUp' ?
            (selectedIndex + resultsList.length) % (resultsList.length + 1)
            :
            (selectedIndex + 1) % (resultsList.length + 1)
        );
        return;
      }

      if (e.key === 'Enter' && resultsList.hasOwnProperty(selectedIndex)) {
        e.preventDefault();
        handleNavigate(selectedIndex);
        return;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resultsList, selectedIndex, showDropdown]);

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
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="w-100"
          ref={searchbarRef}
          value={searchBarQuery}
          onChange={handleChange}
          placeholder='Search'
          onClick={() => setShowDropdown(true)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setSelectedIndex(-1)}
        />
        {isLoading && <LoadingAnimation />}
      </form>

      {/******** DROPDOWN ********/}
      {resultsList && showDropdown && (
        <div id="dropdown">
          <div id="page-nav">
            {/* SUB OR DUB TOGGLE */}
            <button
              onClick={() => handleSubOrDubToggle()}
            >
              <span className={subOrDubOption !== "sub" ? "o-disabled" : ""}>
                Sub&nbsp;
              </span>
              /
              <span className={subOrDubOption !== "dub" ? "o-disabled" : ""}>
                &nbsp;Dub
              </span>
            </button>
          </div>

          {/******** RESULTS ********/}
          <ul
            id='search-results'
            ref={resultsRef}
          >
            {resultsList.length > 0 ? (
              resultsList?.map((result, index) =>
                <li
                  key={result.animeId}
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