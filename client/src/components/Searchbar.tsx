import { getSearch } from "../utils/api";
import { useState, useEffect, useRef } from "react";
import useClickAway from "../utils/hooks/useClickAway";
import { useNavigate, useParams } from "react-router-dom";
import LoadingAnimation from "./LoadingAnimation";

type subOrDub = "sub" | "dub";

interface AnimeDetails {
  animeId: string;
  title: string;
  subOrDub: subOrDub;
  otherNames: string[];
}

interface PreviousResults {
  query: string;
  results: AnimeDetails[]
}

export default function Searchbar() {
  const { animeId } = useParams();

  const [searchBarQuery, setSearchbarQuery] = useState<string>("");
  const [subOrDubOption, setSubOrDubOption] = useState<subOrDub>(
    (localStorage.getItem("subOrDubPref") as subOrDub) ?? "sub"
  );

  // Prevents unnecessary requests when toggling between sub/dub on the same query.
  const previousResultsCache = useRef<PreviousResults>({ query: "", results: [] });

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

  const getSearchWithAbort = async (value: string, subOrDub: subOrDub): Promise<AnimeDetails[]> => {
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

  const isStringValid = (value: string) => {
    return value.length > 0 && value.trim();
  }

  const handleAutoComplete = useRef(async (value: string, subOrDub: subOrDub) => {
    if (value.length === 0 || !isStringValid(value)) {
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
  }

  const handleSubOrDubToggle = async () => {
    if (isLoading || !isStringValid(searchBarQuery)) { return; }

    const newOption = subOrDubOption === "sub" ? "dub" : "sub";
    localStorage.setItem("subOrDubPref", newOption);
    setSubOrDubOption(newOption);

    const handleResults = (results: AnimeDetails[]) => {
      updateSearchResults(results);
      previousResultsCache.current.query = searchBarQuery;
      previousResultsCache.current.results = resultsList ?? [];
    }

    if (searchBarQuery === previousResultsCache.current.query) {
      handleResults(previousResultsCache.current.results);
      return;
    } else {
      try {
        setIsLoading(true);
        const results = await getSearchWithAbort(searchBarQuery, newOption);
        handleResults(results);
      } catch (error: any) {
        if (error.code === "ERR_CANCELED") {
          return;
        }
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
    if (!resultsList) {
      return;
    }
    // Don't navigate to the same anime that the page is already on,
    // otherwise it messes up the current url caused by replaceState() in Watch.tsx's fetchAnime().
    if (resultsList[index].animeId !== animeId) {
      navigate(`/${resultsList[index].animeId}`);
    }
    setSearchbarQuery(resultsList[index].title as string);
    setShowDropdown(false);
    searchbarRef?.current?.blur();
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