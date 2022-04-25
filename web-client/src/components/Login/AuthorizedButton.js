import React, { useState } from "react";
import Login from "./Login";
import "../../styles/login/AuthorizedButton.css";

//mui
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

//redux
import { useSelector } from "react-redux";

const AuthorizedButton = ({
  type,
  children,
  authorized,
  onClick,
  disabled,
}) => {
  const signedIn = useSelector((state) => state.users.signedIn);
  authorized = authorized || signedIn;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {type === "icon" && (
        <IconButton
          style={
            disabled
              ? {
                  pointerEvents: "none",
                  opacity: "0.6",
                }
              : {}
          }
          className="authorized-btn"
          onClick={authorized ? onClick : handleOpen}
        >
          {children}
        </IconButton>
      )}

      {type === "button" && (
        <div
          style={
            disabled
              ? {
                  pointerEvents: "none",
                  opacity: "0.6",
                }
              : {}
          }
          className="authorized-btn"
          onClick={authorized ? onClick : handleOpen}
        >
          {children}
        </div>
      )}

      <Modal open={open} onClose={handleClose}>
        <div className="login-modal">
          <Login
            showSignAsGuest={false}
            navigateAfterLogin={false}
            onLogin={handleClose}
          />
        </div>
      </Modal>
    </>
  );
};

export default AuthorizedButton;
