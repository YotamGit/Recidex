import FilterDialog from "./FilterDialog";
import "../styles/SearchBar.css";

//mui
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

const Search = ({
  recipe_categories,
  recipe_difficulties,
  recipe_durations,
  filterRecipes,
  onSearch,
}) => {
  const [searchText, setsearchText] = useState("");
  return (
    <div className="search-bar-container">
      <InputBase
        className="search-bar-search-field"
        placeholder="Search Recipes"
        inputProps={{ "aria-label": "search recipes" }}
        onChange={(e) => setsearchText(e.target.value)}
      />
      <div className="search-bar-buttons">
        <IconButton onClick={() => onSearch(searchText)} aria-label="search">
          <SearchIcon style={{ fontSize: "3.5vh", color: "#fff" }} />
        </IconButton>

        <Divider
          style={{
            height: "30px",
            margin: "0.5px",
            backgroundColor: "white",
          }}
          orientation="vertical"
        />
        <FilterDialog
          filterRecipes={filterRecipes}
          recipe_categories={recipe_categories}
          recipe_difficulties={recipe_difficulties}
          recipe_durations={recipe_durations}
        />
      </div>
    </div>
  );
};

export default Search;
