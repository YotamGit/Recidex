import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "../../styles/login/AuthorizedButton.css";
import DialogCloseButton from "../buttons/DialogCloseButton";

import RecipesLogo from "../../utils-module/Photos/Recipes.svg";

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

      <Dialog
        open={openChoice}
        onClose={handleCloseChoice}
        fullScreen={!fullscreen}
      >
        <DialogContent>
          <div className="auth-choice-modal">
            <DialogCloseButton onClick={handleCloseChoice} />
            <img src={RecipesLogo} className="recipes-logo" alt="" />
            <div className="choice-content">
              <span style={{ marginBottom: "2px" }}>New to Recipes?</span>
              <span style={{ marginBottom: "20px" }}>
                <span
                  className="text-button"
                  onClick={() => {
                    handleCloseChoice();
                    setAuthChoice("signup");
                    handleOpenAuth();
                  }}
                >
                  Sign Up
                </span>
                {" to upload, edit and collect your favorite recipes."}
              </span>
              <span>
                {"Already have an account? "}
                <span
                  className="text-button"
                  onClick={() => {
                    handleCloseChoice();
                    setAuthChoice("login");
                    handleOpenAuth();
                  }}
                >
                  Log In
                </span>
              </span>
            </div>
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
