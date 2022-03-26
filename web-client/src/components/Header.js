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

//redux
import { useSelector } from "react-redux";

const Header = ({ show_search }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const firstname = useSelector((state) => state.users.firstname);
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
            <span>Recipes</span>
            {firstname && <span> - Hello {firstname}</span>}
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
