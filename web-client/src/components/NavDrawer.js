import { useNavigate } from "react-router-dom";
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
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

//redux
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../slices/usersSlice";

const NavDrawer = ({ openDrawer, handleToggleDrawer }) => {
  const dispatch = useDispatch();
  const signedIn = useSelector((state) => state.users.signedIn);
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
      <span
        className="drawer-button-wrapper"
        onClick={() => {
          navigate("/home");
          handleToggleDrawer();
        }}
      >
        <HomeRoundedIcon className="drawer-button" />
        Home
      </span>
      {signedIn ? (
        <>
          <span
            className="drawer-button-wrapper"
            onClick={() => {
              dispatch(clearUser());
              handleToggleDrawer();
            }}
          >
            <LogoutRoundedIcon className="drawer-button" />
            Log Out
          </span>
        </>
      ) : (
        <>
          <span
            className="drawer-button-wrapper"
            onClick={() => {
              navigate("/login");
              handleToggleDrawer();
            }}
          >
            <PatternRoundedIcon className="drawer-button" />
            Login
          </span>
          <span
            className="drawer-button-wrapper"
            onClick={() => {
              navigate("/signup");
              handleToggleDrawer();
            }}
          >
            <PatternRoundedIcon className="drawer-button" />
            Signup
          </span>
        </>
      )}

      <span
        className="drawer-button-wrapper"
        onClick={() => {
          navigate("/recipes/new");
          handleToggleDrawer();
        }}
      >
        <AddCircleRoundedIcon className="drawer-button" />
        Add Recipe
      </span>
    </Drawer>
  );
};

export default NavDrawer;
