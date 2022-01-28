import FilterDialog from "./FilterDialog";
import "../styles/SearchBar.css";

//mui
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";

const Search = ({
  recipe_categories,
  recipe_difficulties,
  recipe_durations,
  filterRecipes,
  onSearch,
}) => {
  const [searchText, setsearchText] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Enter") {
        onSearch(searchText);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchText]);

  return (
    <>
      <div className="search-bar-container">
        <IconButton
          className="search-icon-wrapper"
          onClick={() => onSearch(searchText)}
          aria-label="search"
        >
          <SearchIcon style={{ fontSize: "3vh", color: "white" }} />
        </IconButton>
        <InputBase
          className="search-bar-search-field"
          placeholder="Search Recipes"
          inputProps={{ "aria-label": "search recipes" }}
          onChange={(e) => setsearchText(e.target.value)}
        />
      </div>
      <FilterDialog
        filterRecipes={filterRecipes}
        recipe_categories={recipe_categories}
        recipe_difficulties={recipe_difficulties}
        recipe_durations={recipe_durations}
      />
    </>
  );
};

export default Search;
