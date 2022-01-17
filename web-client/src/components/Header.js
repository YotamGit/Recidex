import { Link } from "react-router-dom";
import "../styles/Header.css";

import FilterDialog from "./FilterDialog";

//mui icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import PatternRoundedIcon from "@mui/icons-material/PatternRounded";
import { useState, useEffect } from "react";
import { padding } from "@mui/system";

const Header = ({
  signedIn,
  show_add_button,
  show_filter_button,
  recipe_categories,
  recipe_difficulties,
  recipe_durations,
  filterRecipes,
}) => {
  return (
    <div className="header">
      <div>
        <Link className="header-btn" to="/home">
          <HomeRoundedIcon style={{ fontSize: "3.5vh" }} />
        </Link>
        {!signedIn && (
          <Link className="header-btn" to="/login">
            <PatternRoundedIcon style={{ fontSize: "3.5vh" }} />
          </Link>
        )}
        {show_add_button && signedIn && (
          <Link className="header-btn" to="/recipes/new">
            <AddCircleRoundedIcon style={{ fontSize: "3.5vh" }} />
          </Link>
        )}
      </div>
      {show_filter_button && (
        <>
          <FilterDialog
            filterRecipes={filterRecipes}
            recipe_categories={recipe_categories}
            recipe_difficulties={recipe_difficulties}
            recipe_durations={recipe_durations}
          />
        </>
      )}
    </div>
  );
};

export default Header;
