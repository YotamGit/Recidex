import React, { MouseEventHandler, FC, useState } from "react";
import Authentication from "./Authentication";
import "../../styles/login/AuthorizedButton.css";
import DialogCloseButton from "../buttons/DialogCloseButton";

import RecidexLogo from "../../utils-module/Photos/RecidexLogo.svg";

//mui
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

//redux
import { useAppSelector } from "../../hooks";

interface propTypes {
  type: "icon" | "button";
  style?: React.CSSProperties;
  children: React.ReactNode;
  authorized?: boolean;
  onClick: MouseEventHandler;
  disabled?: boolean;
}

const AuthorizedButton: FC<propTypes> = ({
  type,
  style,
  children,
  authorized,
  onClick,
  disabled,
}) => {
  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);
  const signedIn = useAppSelector((state) => state.users.signedIn);
  authorized = authorized || signedIn;

  const [openAuth, setOpenAuth] = useState(false);
  const handleOpenAuth = () => setOpenAuth(true);
  const handleCloseAuth = () => setOpenAuth(false);

  const [openChoice, setOpenChoice] = useState(false);
  const handleOpenChoice = () => setOpenChoice(true);
  const handleCloseChoice = () => setOpenChoice(false);

  const [authChoice, setAuthChoice] = useState<"signup" | "login">();

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
            <img src={RecidexLogo} className="recidex-logo" alt="" />
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
            <Authentication
              action={authChoice}
              showSignAsGuest={false}
              showOtherAuthOption={false}
              navigateAfterLogin={false}
              onLogin={handleCloseAuth}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthorizedButton;
