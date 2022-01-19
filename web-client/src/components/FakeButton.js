import React, { useState } from "react";
import Login from "./Login";

//mui
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";

const FakeButton = ({ children, setSignedIn }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton onClick={handleOpen} style={{ color: "gray", margin: "1%" }}>
        {children}
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <Login setSignedIn={setSignedIn} />
      </Modal>
    </>
  );
};

export default FakeButton;
