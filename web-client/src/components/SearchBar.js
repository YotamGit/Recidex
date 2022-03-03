import FilterDialog from "./FilterDialog";
import "../styles/SearchBar.css";

//mui
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";

//redux
import { useDispatch } from "react-redux";
import { searchRecipes } from "../slices/recipesSlice";

const SearchBar = () => {
  const dispatch = useDispatch();
  const [searchText, setsearchText] = useState("");

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.code === "Enter") {
        await dispatch(searchRecipes(searchText));
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
          onClick={() => dispatch(searchRecipes(searchText))}
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
      <FilterDialog />
    </>
  );
};

export default SearchBar;
