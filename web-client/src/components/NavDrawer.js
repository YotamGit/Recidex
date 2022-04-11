import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

//redux
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../slices/usersSlice";

const NavDrawer = ({ openDrawer, handleToggleDrawer }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { firstname, lastname } = useSelector((state) => state.users);
  const signedIn = useSelector((state) => state.users.signedIn);

  const [activePage, setActivePage] = useState("");

  return (
    <Drawer
      id="drawer"
      anchor="left"
      open={openDrawer}
      onClose={handleToggleDrawer}
    >
      <div id="drawer-header">
        {signedIn && (
          <div className="user-name">
            <div style={{ fontWeight: "650" }}>{"Signed In"}</div>
            <div>{`${firstname} ${lastname}`}</div>
          </div>
        )}
        <IconButton onClick={handleToggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <span
        className={`${
          activePage === "home" && "active-page"
        } drawer-button-wrapper`}
        onClick={() => {
          navigate("/home");
          setActivePage("home");
          handleToggleDrawer();
        }}
      >
        <HomeRoundedIcon className="drawer-button" />
        Home
      </span>
      {signedIn && (
        <>
          <span
            className={`${
              activePage === "my-recipes" && "active-page"
            } drawer-button-wrapper`}
            onClick={() => {
              navigate("/my-recipes");
              setActivePage("my-recipes");
              handleToggleDrawer();
            }}
          >
            <MenuBookIcon className="drawer-button" />
            My Recipes
          </span>
        </>
      )}
      {signedIn && (
        <>
          <span
            className={`${
              activePage === "favorites" && "active-page"
            } drawer-button-wrapper`}
            onClick={() => {
              navigate("/favorites");
              setActivePage("favorites");
              handleToggleDrawer();
            }}
          >
            <FavoriteRoundedIcon className="drawer-button" />
            Favorites
          </span>
        </>
      )}
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
        className={`${
          activePage === "add-recipe" && "active-page"
        } drawer-button-wrapper`}
        onClick={() => {
          navigate("/recipes/new");
          setActivePage("add-recipe");
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
