import { Link } from "react-router-dom";
import "../styles/Header.css";

import FilterDialog from "./FilterDialog";
import FakeButton from "./FakeButton";

//mui icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import PatternRoundedIcon from "@mui/icons-material/PatternRounded";

const Header = ({
  signedIn,
  setSignedIn,
  show_add_button,
  show_filter_button,
  recipe_categories,
  recipe_difficulties,
  recipe_durations,
  filterRecipes,
}) => {
  return (
    <div className="header">
      <div id="header-left-button-group">
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
        {!signedIn && (
          <FakeButton setSignedIn={setSignedIn} className="header-btn">
            <AddCircleRoundedIcon style={{ fontSize: "3.5vh" }} />
          </FakeButton>
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
