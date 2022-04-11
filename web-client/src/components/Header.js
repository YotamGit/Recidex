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

const Header = ({ pageName, show_search }) => {
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
          <span className="app-bar-title">
            <span>{pageName}</span>
          </span>

          {show_search && <SearchBar />}
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
