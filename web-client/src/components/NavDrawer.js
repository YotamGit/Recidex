import { useNavigate, Link } from "react-router-dom";
import AuthorizedButton from "./AuthorizedButton";
import "../styles/NavDrawer.css";

//mui
//import MuiDrawer from "@mui/material/Drawer";
import Drawer from "@mui/material/Drawer";

import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

//mui icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import PatternRoundedIcon from "@mui/icons-material/PatternRounded";
const NavDrawer = ({
  openDrawer,
  handleToggleDrawer,
  signedIn,
  setSignedIn,
}) => {
  const navigate = useNavigate();
  return (
    <Drawer
      id="drawer"
      anchor="left"
      open={openDrawer}
      onClose={handleToggleDrawer}
    >
      <div id="drawer-header">
        <IconButton onClick={handleToggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <span className="drawer-button-wrapper" onClick={() => navigate("/home")}>
        <HomeRoundedIcon className="drawer-button" />
        Home
      </span>
      {!signedIn && (
        <span
          className="drawer-button-wrapper"
          onClick={() => navigate("/login")}
        >
          <PatternRoundedIcon className="drawer-button" />
          Login
        </span>
      )}
      {/* <AuthorizedButton
        onClick={() => navigate("/recipes/new")}
        authorized={signedIn}
        setSignedIn={setSignedIn}
      > */}
      <span
        className="drawer-button-wrapper"
        onClick={() => navigate("/recipes/new")}
      >
        <AddCircleRoundedIcon className="drawer-button" />
        Add Recipe
      </span>
      {/* </AuthorizedButton> */}
    </Drawer>
  );
};

export default NavDrawer;
