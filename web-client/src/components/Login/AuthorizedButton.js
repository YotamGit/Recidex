import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "../../styles/login/AuthorizedButton.css";
import DialogCloseButton from "../buttons/DialogCloseButton";

//mui
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

//redux
import { useSelector } from "react-redux";

const AuthorizedButton = ({
  type,
  style,
  children,
  authorized,
  onClick,
  disabled,
}) => {
  const fullscreen = useSelector((state) => state.utilities.fullscreen);
  const signedIn = useSelector((state) => state.users.signedIn);
  authorized = authorized || signedIn;

  const [openAuth, setOpenAuth] = useState(false);
  const handleOpenAuth = () => setOpenAuth(true);
  const handleCloseAuth = () => setOpenAuth(false);

  const [openChoice, setOpenChoice] = useState(false);
  const handleOpenChoice = () => setOpenChoice(true);
  const handleCloseChoice = () => setOpenChoice(false);

  const [authChoice, setAuthChoice] = useState();

  return (
    <>
      {type === "icon" && (
        <IconButton
          style={
            disabled
              ? {
                  pointerEvents: "none",
                  opacity: "0.6",
                  ...style,
                }
              : { ...style }
          }
          className="authorized-btn"
          onClick={authorized ? onClick : handleOpenChoice}
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
          onClick={authorized ? onClick : handleOpenChoice}
        >
          {children}
        </div>
      )}

      <Dialog open={openChoice} onClose={handleCloseChoice}>
        <DialogContent>
          <div className="auth-choice-modal">
            <DialogCloseButton onClick={handleCloseChoice} />
            <Button
              variant="contained"
              onClick={() => {
                handleCloseChoice();
                setAuthChoice("login");
                handleOpenAuth();
              }}
            >
              login
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleCloseChoice();
                setAuthChoice("signup");
                handleOpenAuth();
              }}
            >
              signup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openAuth}
        onClose={handleCloseAuth}
        fullScreen={!fullscreen}
      >
        <DialogContent>
          <div className="login-modal">
            <DialogCloseButton onClick={handleCloseAuth} />

            {authChoice === "login" && (
              <Login
                showSignAsGuest={false}
                showOtherAuthOption={false}
                navigateAfterLogin={false}
                onLogin={handleCloseAuth}
              />
            )}
            {authChoice === "signup" && (
              <Signup
                showSignAsGuest={false}
                showOtherAuthOption={false}
                navigateAfterLogin={false}
                onLogin={handleCloseAuth}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthorizedButton;
