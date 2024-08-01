import { getSearchV2 } from "../utils/api";
import { useState, useEffect, useRef, useContext } from "react";
import useClickAway from "../utils/hooks/useClickAway";
import { useNavigate } from "react-router-dom";
import { WatchContext } from "../contexts/WatchProvider";

interface AnimeDetails {
  animeId: string;
  title: string;
  subOrDub: "sub" | "dub";
  otherNames: string[];
}

export default function Searchbar() {
  const { setEpisodeNoState } = useContext(WatchContext);

  const [searchBarQuery, setSearchbarQuery] = useState<string>("");
  const [subOrDubOption, setSubOrDubOption] = useState<"sub" | "dub">("sub");

  const [resultsList, setResultsList] = useState<AnimeDetails[]>();

  // Up/Down key search result selection.
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const searchbarRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const searchContainer = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const navigate = useNavigate();

  useClickAway(searchContainer.current, () => {
    setShowDropdown(false);
  });

  const handleAutoComplete = async (value: string) => {
    setSearchbarQuery(value);

    if (value.length > 2) {
      const results = await getSearchV2(value, subOrDubOption);
      updateSearchResults(results);
    }
  };

  const updateSearchResults = (results: AnimeDetails[]) => {
    setResultsList(results);
    setShowDropdown(true);
  }

  const handleSubOrDubToggle = async () => {
    const option = subOrDubOption === "sub" ? "dub" : "sub";
    if (searchBarQuery.length > 0) {
      const results = await getSearchV2(searchBarQuery, option);
      updateSearchResults(results);
    }
    setSubOrDubOption(option);
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
    if (resultsList?.hasOwnProperty(selectedIndex)) {
      resultsRef.current?.children[selectedIndex]
        .scrollIntoView(selectedIndex === resultsList.length - 1);
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
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="w-100"
          ref={searchbarRef}
          value={searchBarQuery}
          onChange={(e) => (
            setSelectedIndex(-1),
            setSearchbarQuery(e.target.value),
            handleAutoComplete(e.target.value)
          )}
          placeholder='Search'
          onClick={() => setShowDropdown(true)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setSelectedIndex(-1)}
        />
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