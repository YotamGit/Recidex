import { useState, useEffect } from "react";
import FilterDialog from "./FilterDialog";
import "../../styles/app_bar/SearchBar.css";

import { getRecipeTitles } from "../../utils-module/recipes";

//mui
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

//mui icons
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

//redux
import { useAppSelector, useAppDispatch } from "../../hooks";
import { getRecipes } from "../../slices/recipesSlice";
import { setSearchText as setStoreSearchText } from "../../slices/filtersSlice";

//types
import { FC } from "react";
import { TSelectedFilters } from "../../slices/filtersSlice";

interface propTypes {
  setExpanded?: Function;
  responsive: boolean;
  localSearch?: {
    getRecipes: Function;
    filtered: boolean;
    setFiltered: Function;
    searchText: string;
    setSearchText: Function;
    selectedFilters: TSelectedFilters;
  };
}
const SearchBar: FC<propTypes> = ({ setExpanded, localSearch, responsive }) => {
  const dispatch = useAppDispatch();
  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);
  const filtered = useAppSelector((state) => state.filters.filtered);
  const titleFilters = useAppSelector((state) => state.filters.titleFilters);

  const [maximizeSearch, setMaximizeSearch] = useState(false);

  const [searchText, setSearchText] = useState(
    useAppSelector((state) => state.filters.searchText) || ""
  );

  const [openOptions, setOpenOptions] = useState(false);
  const [titles, setTitles] = useState<string[]>([]);
  const loading = openOptions && titles.length === 0;

  const searchRecipes = async () => {
    //search recipes without the store
    if (localSearch) {
      localSearch.getRecipes();
      return;
    }

    //search recipes using store
    dispatch(setStoreSearchText(searchText));
    await dispatch(getRecipes({ replace: true }));
  };
  //detect enter key to search
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        await searchRecipes();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // get recipe titles when dropdown is opened
  useEffect(() => {
    let active: boolean = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      let res: string[] = await getRecipeTitles(titleFilters);
      if (active) {
        setTitles(res);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, titleFilters]);

  // reset titles when dropdown is closed to retrieve an updated list
  // next time it is opened
  useEffect(() => {
    if (!openOptions) {
      setTitles([]);
    }
  }, [openOptions]);

  return (
    <>
      {!responsive || fullscreen || maximizeSearch ? (
        <div className="search-bar-container">
          <div className="search-container">
            <IconButton
              className="search-icon-wrapper"
              onClick={() => searchRecipes()}
              aria-label="search"
            >
              <SearchIcon className="icon" />
            </IconButton>
            <Autocomplete
              className="search-bar-search-field"
              autoComplete={true}
              open={openOptions}
              onOpen={() => setOpenOptions(true)}
              onClose={() => setOpenOptions(false)}
              options={titles}
              onChange={(e, value) => {
                localSearch
                  ? localSearch.setSearchText(value || "")
                  : setSearchText(value || "");
              }}
              value={localSearch ? localSearch.searchText : searchText}
              //can't figure out what the types of option and value should be
              //so I'm leaving it as "any" for now
              isOptionEqualToValue={(option: any, value: any) =>
                option.value === value.value
              } //disable warning
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => {
                    localSearch
                      ? localSearch.setSearchText(e.target.value)
                      : setSearchText(e.target.value);
                  }}
                  placeholder="Search Recipes"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading && (
                          <CircularProgress
                            style={{ marginRight: "10px", color: "#86abd1" }}
                            size={20}
                          />
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <FilterDialog localSearch={localSearch} />
          </div>
          {maximizeSearch && (
            <IconButton
              onClick={() => {
                setMaximizeSearch(false);
                setExpanded && setExpanded(false);
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          )}
        </div>
      ) : (
        <>
          <IconButton
            onClick={() => {
              setMaximizeSearch(true);
              setExpanded && setExpanded(true);
            }}
            aria-label="search"
          >
            <SearchIcon
              className="icon"
              style={{
                color: (localSearch ? localSearch.filtered : filtered)
                  ? "rgb(125, 221, 112)"
                  : "",
              }}
            />
          </IconButton>
        </>
      )}
    </>
  );
};

export default SearchBar;
