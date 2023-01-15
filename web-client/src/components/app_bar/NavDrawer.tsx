import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/app_bar/NavDrawer.css";
import DrawerItem from "./DrawerItem";
import SocialIcon from "../buttons/SocialIcon";

//mui
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

//mui icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import FactCheckIcon from "@mui/icons-material/FactCheck";

//redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { clearUserData } from "../../slices/usersSlice";

//types
import { ModalProps } from "@mui/material";
import { FC, MouseEventHandler } from "react";

interface propTypes {
  openDrawer: boolean;
  handleToggleDrawer: Function;
}

const NavDrawer: FC<propTypes> = ({ openDrawer, handleToggleDrawer }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { firstname, lastname } = useAppSelector(
    (state) => state.users.userData
  );
  const signedIn = useAppSelector((state) => state.users.signedIn);
  const userRole = useAppSelector((state) => state.users.userData.role);

  const [activePage, setActivePage] = useState(location.pathname);

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  return (
    <Drawer
      className="drawer"
      anchor="left"
      open={openDrawer}
      onClose={handleToggleDrawer as ModalProps["onClose"]}
    >
      <div className="drawer-header">
        {signedIn && (
          <>
            <div className="user-name">
              <div style={{ fontWeight: "650" }}>{"Signed In"}</div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/user/account");
                  handleToggleDrawer();
                }}
              >{`${firstname} ${lastname}`}</div>
            </div>
          </>
        )}
        <IconButton onClick={handleToggleDrawer as MouseEventHandler}>
          <ChevronLeftIcon className="icon" />
        </IconButton>
      </div>
      <Divider />
      <div className="pages-container">
        <DrawerItem
          visible={true}
          addDivider={false}
          currentPageUrl={activePage}
          pageUrl={"/home"}
          text={"Home"}
          closeDrawer={handleToggleDrawer}
          Icon={HomeRoundedIcon}
        />
        <DrawerItem
          visible={signedIn}
          addDivider={false}
          currentPageUrl={activePage}
          pageUrl={"/my-recipes"}
          text={"My Recipes"}
          closeDrawer={handleToggleDrawer}
          Icon={MenuBookIcon}
        />
        <DrawerItem
          visible={signedIn}
          addDivider={false}
          currentPageUrl={activePage}
          pageUrl={"/favorites"}
          text={"Favorites"}
          closeDrawer={handleToggleDrawer}
          Icon={FavoriteRoundedIcon}
        />
        <DrawerItem
          visible={true}
          addDivider={false}
          currentPageUrl={activePage}
          pageUrl={"/recipes/new"}
          text={"Add Recipe"}
          closeDrawer={handleToggleDrawer}
          Icon={AddCircleRoundedIcon}
        />

        <DrawerItem
          visible={signedIn && ["admin", "moderator"].includes(userRole || "")}
          addDivider={true}
          currentPageUrl={activePage}
          pageUrl={"/admin-panel"}
          text={"Admin Panel"}
          closeDrawer={handleToggleDrawer}
          Icon={AdminPanelSettingsIcon}
        />
        <DrawerItem
          visible={signedIn && ["admin", "moderator"].includes(userRole || "")}
          addDivider={false}
          currentPageUrl={activePage}
          pageUrl={"/recipe-moderation"}
          text={"Recipe Moderation"}
          closeDrawer={handleToggleDrawer}
          Icon={FactCheckIcon}
        />

        <DrawerItem
          visible={!signedIn}
          addDivider={true}
          currentPageUrl={activePage}
          pageUrl={"/login"}
          text={"Log In"}
          closeDrawer={handleToggleDrawer}
          Icon={LoginRoundedIcon}
        />
        <DrawerItem
          visible={!signedIn}
          addDivider={false}
          currentPageUrl={activePage}
          pageUrl={"/signup"}
          text={"Sign Up"}
          closeDrawer={handleToggleDrawer}
          Icon={PersonAddAltRoundedIcon}
        />
        <div className="drawer-footer">
          <div className="socials">
            <SocialIcon social="github" />
            <SocialIcon social="linkedin" />
          </div>
          <div
            className="about-button"
            onClick={() => {
              navigate("/about");
              handleToggleDrawer();
            }}
          >
            About
          </div>
          <DrawerItem
            visible={signedIn}
            addDivider={false}
            currentPageUrl={activePage}
            text={"Log Out"}
            closeDrawer={handleToggleDrawer}
            onClick={() => {
              dispatch(clearUserData());
              navigate("/");
            }}
            Icon={LogoutRoundedIcon}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default NavDrawer;
