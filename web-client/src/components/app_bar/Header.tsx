import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/app_bar/Header.css";
import RecipesLogo from "../../utils-module/Photos/Recipes.svg";

import NavDrawer from "./NavDrawer";
import SearchBar from "./SearchBar";
import AccountAvatar from "./AccountAvatar";

//mui
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";

//mui icons
import MenuIcon from "@mui/icons-material/Menu";

//types
import { FC } from "react";

interface propTypes {
  pageName: string;
  showSearch: boolean;
}
const Header: FC<propTypes> = ({ pageName, showSearch }) => {
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [maximizeSearch, setMaximizeSearch] = useState(false);

  const handleToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  useEffect(() => {
    if (!showSearch) {
      setMaximizeSearch(false);
    }
  }, [showSearch]);

  return (
    <>
      <AppBar position="sticky" className="header">
        <Toolbar className="app-bar">
          <IconButton
            aria-label="open drawer"
            onClick={handleToggleDrawer}
            edge="start"
          >
            <MenuIcon className="icon" />
          </IconButton>

          <div className="content">
            {!maximizeSearch && (
              <span className="logo-container">
                <img
                  className="logo"
                  src={RecipesLogo}
                  onClick={() => navigate("/home")}
                  alt=""
                ></img>
                <span>&nbsp;{pageName}</span>
              </span>
            )}
            {showSearch && (
              <SearchBar responsive={true} setExpanded={setMaximizeSearch} />
            )}

            {!maximizeSearch && <AccountAvatar />}
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
