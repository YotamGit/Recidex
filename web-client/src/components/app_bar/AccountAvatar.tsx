import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/app_bar/AccountAvatar.css";
//mui
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

//mui icons
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";

//redux
import { useAppSelector, useAppDispatch } from "../../hooks";
import { clearUserData } from "../../slices/usersSlice";
//types
import { FC } from "react";

const AccountAvatar: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userData = useAppSelector((state) => state.users.userData);
  const signedIn = useAppSelector((state) => state.users.signedIn);

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <>
      <Tooltip title="Account Menu">
        <IconButton
          style={{ marginLeft: "auto" }}
          className="account-avatar"
          onClick={handleClick}
          sx={{ p: 0 }}
        >
          {signedIn ? (
            <Avatar>{`${userData.firstname
              ?.slice(0, 1)
              .toUpperCase()}${userData.lastname
              ?.slice(0, 1)
              .toUpperCase()}`}</Avatar>
          ) : (
            <Avatar />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElement}
        className="account-avatar-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {signedIn
          ? [
              <MenuItem
                key="profile"
                onClick={() => navigate(`/user/profile/${userData._id}`)}
              >
                <Avatar className="avatar" /> Profile
              </MenuItem>,

              <MenuItem
                key="my-account"
                onClick={() => navigate(`/user/account`)}
              >
                <Avatar className="avatar" /> My Account
              </MenuItem>,

              <Divider key="divider" />,
              <MenuItem key="logout" onClick={() => dispatch(clearUserData())}>
                <ListItemIcon>
                  <LogoutRoundedIcon fontSize="small" />
                </ListItemIcon>
                Log Out
              </MenuItem>,
            ]
          : [
              <MenuItem key="login" onClick={() => navigate(`/login`)}>
                <ListItemIcon>
                  <LoginRoundedIcon fontSize="small" />
                </ListItemIcon>
                Log In
              </MenuItem>,

              <MenuItem key="signup" onClick={() => navigate(`/signup`)}>
                <ListItemIcon>
                  <PersonAddAltRoundedIcon fontSize="small" />
                </ListItemIcon>
                Sign Up
              </MenuItem>,
            ]}
      </Menu>
    </>
  );
};

export default AccountAvatar;
