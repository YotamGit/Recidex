import { Link } from "react-router-dom";
import "../styles/Header.css";

import FilterDialog from "./FilterDialog";

//mui icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

const Header = ({
  filterRecipes,
  show_add_button,
  show_filter_button,
  recipe_categories,
  recipe_difficulties,
  recipe_durations,
}) => {
  return (
    <div className="header">
      <div>
        <Link className="header-btn" to="/home">
          <HomeRoundedIcon style={{ fontSize: "3.5vh" }} />
        </Link>
        {show_add_button && (
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
