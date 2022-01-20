import React, { useState } from "react";
import Login from "./Login";
import "../styles/FakeButton.css";

//mui
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";

const FakeButton = ({ children, setSignedIn }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton className="fake-btn" onClick={handleOpen}>
        {children}
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <div className="login-modal">
          <Login
            setSignedIn={setSignedIn}
            showSignAsGuest={false}
            navigateAfterLogin={false}
          />
        </div>
      </Modal>
    </>
  );
};

export default FakeButton;
