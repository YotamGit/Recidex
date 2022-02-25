import { useState } from "react";
import "../styles/Header.css";

import NavDrawer from "./NavDrawer";

import SearchBar from "./SearchBar";

//mui
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";

//mui icons
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({
  show_add_button,
  show_search,
  recipe_categories,
  recipe_difficulties,
  recipe_durations,
  filterRecipes,
  onSearch,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <>
      <AppBar className="app-bar" position="sticky">
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleToggleDrawer}
            edge="start"
          >
            <MenuIcon style={{ fontSize: "3vh", color: "white" }} />
          </IconButton>
          <div className="app-bar-title">Recipes</div>
          {show_search && (
            <SearchBar
              filterRecipes={filterRecipes}
              recipe_categories={recipe_categories}
              recipe_difficulties={recipe_difficulties}
              recipe_durations={recipe_durations}
              onSearch={onSearch}
            />
          )}
        </Toolbar>
      </AppBar>
      <NavDrawer
        openDrawer={openDrawer}
        handleToggleDrawer={handleToggleDrawer}
      />
    </>
  );
};

export default Header;
