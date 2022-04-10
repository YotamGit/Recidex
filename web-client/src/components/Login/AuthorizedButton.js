import React, { useState } from "react";
import Login from "./Login";
import "../../styles/login/AuthorizedButton.css";

//mui
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";

//redux
import { useSelector } from "react-redux";

const AuthorizedButton = ({ children, authorized, onClick, disabled }) => {
  const signedIn = useSelector((state) => state.users.signedIn);
  authorized = authorized || signedIn;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
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
