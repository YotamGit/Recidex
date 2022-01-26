import { useNavigate, Link } from "react-router-dom";
import "../styles/Header.css";

import AuthorizedButton from "./AuthorizedButton";
import SearchBar from "./SearchBar";

//mui icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import PatternRoundedIcon from "@mui/icons-material/PatternRounded";

const Header = ({
  signedIn,
  setSignedIn,
  show_add_button,
  show_search,
  recipe_categories,
  recipe_difficulties,
  recipe_durations,
  filterRecipes,
  onSearch,
}) => {
  const navigate = useNavigate();
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

        {show_add_button && (
          <AuthorizedButton
            onClick={() => navigate("/recipes/new")}
            authorized={signedIn}
            setSignedIn={setSignedIn}
          >
            <AddCircleRoundedIcon
              className="header-btn"
              style={{ fontSize: "3.5vh" }}
            />
          </AuthorizedButton>
        )}
      </div>
      {show_search && (
        <div className="search-bar-section">
          <SearchBar
            filterRecipes={filterRecipes}
            recipe_categories={recipe_categories}
            recipe_difficulties={recipe_difficulties}
            recipe_durations={recipe_durations}
            onSearch={onSearch}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
