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

//redux
import { useDispatch } from "react-redux";
import { getRecipes } from "../slices/recipesSlice";
import { setSearchText as setStoreSearchText } from "../slices/filtersSlice";

const SearchBar = () => {
  const dispatch = useDispatch();
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
      <div className="search-bar-container">
        <IconButton
          className="search-icon-wrapper"
          onClick={() => searchRecipes()}
          aria-label="search"
        >
          <SearchIcon style={{ fontSize: "3vh", color: "white" }} />
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
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </div>
      <FilterDialog />
    </>
  );
};

export default SearchBar;
