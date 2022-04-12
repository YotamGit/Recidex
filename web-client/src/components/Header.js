import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import RecipesLogo from "../utils-module/Photos/Recipes.svg";

import NavDrawer from "./NavDrawer";
import SearchBar from "./SearchBar";

//mui
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";

//mui icons
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({ pageName, show_search }) => {
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [maximizeSearch, setMaximizeSearch] = useState(false);

  const handleToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  useEffect(() => {
    if (!show_search) {
      setMaximizeSearch(false);
    }
  }, [show_search]);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar className="app-bar">
          <IconButton
            aria-label="open drawer"
            onClick={handleToggleDrawer}
            edge="start"
          >
            <MenuIcon style={{ fontSize: "30px", color: "white" }} />
          </IconButton>

          <div className="content">
            <span
              style={maximizeSearch ? { display: "none" } : {}}
              className="page-title"
            >
              <img
                className="logo"
                src={RecipesLogo}
                onClick={() => navigate("/home")}
              ></img>
              <span>&nbsp;{pageName}</span>
            </span>
            {show_search && <SearchBar setExpanded={setMaximizeSearch} />}
          </div>
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
