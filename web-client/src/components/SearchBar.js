import { useState, useEffect } from "react";
import FilterDialog from "./FilterDialog";
import "../styles/SearchBar.css";

import { getRecipeTitles } from "../utils-module/recipes";

//mui
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

//mui icons
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

//redux
import { useDispatch } from "react-redux";
import { getRecipes } from "../slices/recipesSlice";
import { setSearchText as setStoreSearchText } from "../slices/filtersSlice";

const SearchBar = ({ setExpanded }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const [maximizeSearch, setMaximizeSearch] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [openOptions, setOpenOptions] = useState(false);
  const [titles, setTitles] = useState([]);
  const loading = openOptions && titles.length === 0;

  const searchRecipes = async () => {
    dispatch(setStoreSearchText(searchText));
    await dispatch(getRecipes({ replace: true, args: {} }));
  };
  //detect enter key to search
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.code === "Enter") {
        await searchRecipes();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchText]);

  // get recipe titles when dropdown is opened
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      var res = await getRecipeTitles(); // For demo purposes.
      if (active) {
        setTitles(res);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  // reset titles when dropdown is closed to retrieve an updated list
  // next time it is opened
  useEffect(() => {
    if (!openOptions) {
      setTitles([]);
    }
  }, [openOptions]);

  return (
    <>
      {fullScreen || maximizeSearch ? (
        <div className="search-bar-container">
          <div className="search-container">
            <IconButton
              className="search-icon-wrapper"
              onClick={() => searchRecipes()}
              aria-label="search"
            >
              <SearchIcon style={{ fontSize: "30px", color: "white" }} />
            </IconButton>
            <Autocomplete
              className="search-bar-search-field"
              autoComplete={true}
              open={openOptions}
              onOpen={() => setOpenOptions(true)}
              onClose={() => setOpenOptions(false)}
              options={titles}
              onChange={(e, value) => {
                setSearchText(value);
              }}
              value={searchText}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  placeholder="Search Recipes"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading && (
                          <CircularProgress color="inherit" size={20} />
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <FilterDialog />
          </div>
          {maximizeSearch && (
            <IconButton
              onClick={() => {
                setMaximizeSearch(false);
                setExpanded(false);
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          )}
        </div>
      ) : (
        <>
          <IconButton
            className="search-icon-wrapper"
            onClick={() => {
              setMaximizeSearch(true);
              setExpanded(true);
            }}
            aria-label="search"
          >
            <SearchIcon style={{ fontSize: "30px", color: "white" }} />
          </IconButton>
        </>
      )}
    </>
  );
};

export default SearchBar;
