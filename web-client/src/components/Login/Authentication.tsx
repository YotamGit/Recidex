import "../../styles/login/Authentication.css";

//utils
import {
  validUsername,
  validPassword,
  validEmail,
} from "../../utils-module/validation";

import { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";

import RecidexLogo from "../utilities/RecidexLogo";
import InputWithError from "../utilities/InputWithError";

//mui
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

//redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { signInUser } from "../../slices/usersSlice";
import { setAlert } from "../../slices/utilitySlice";

//types
import { User } from "../../slices/usersSlice";
interface propTypes {
  action: "signup" | "login" | undefined;
  showSignAsGuest: boolean;
  showOtherAuthOption: boolean;
  navigateAfterLogin: boolean;
  onLogin?: Function;
}

const Authentication: FC<propTypes> = ({
  action,
  showSignAsGuest,
  showOtherAuthOption,
  navigateAfterLogin,
  onLogin,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
  const [passwordconfirm, setPasswordConfirm] = useState("");

  const [passwordsMismatch, setPasswordsMismatch] = useState(false);
  const wrongCredentials = useAppSelector(
    (state) => state.users.wrongCredentials
  );

  const [disableButtons, setDisableButtons] = useState(false);

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      onSubmit();
    }
  };

  const validateInput = async () => {
    //check existance of required fields
    if (
      firstname === "" ||
      lastname === "" ||
      email === "" ||
      username === "" ||
      password === ""
    ) {
      //print error required fields
      dispatch(
        setAlert({
          severity: "warning",
          title: "Warning",
          message: "Please fill all of the fields.",
        })
      );
      return false;
    }

    if (!validUsername(username, true)) {
      return false;
    }

    if (!validPassword(password)) {
      return false;
    }

    //confirm the user passwords
    if (password !== passwordconfirm) {
      setPasswordsMismatch(true);
      setPasswordConfirm("");
      return false;
    }

    if (!(await validEmail(email))) {
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if (!action) {
      return;
    }

    if (action === "signup" && !(await validateInput())) {
      return;
    }

    setDisableButtons(true);
    let signInRes = await dispatch(
      signInUser({
        userData: {
          firstname,
          lastname,
          email,
          username,
          password,
        },
        action,
      })
    );
    setDisableButtons(false);
    if (signInRes.meta.requestStatus === "fulfilled") {
      if (navigateAfterLogin) {
        navigate("/home");
      }
      onLogin && onLogin(); //for closing signup/login modal
    }
  };

  return (
    <div id="authentication-page" onKeyPress={handleKeyPress}>
      <RecidexLogo />
      <div className="authentication-section">
        <div className="title">
          {action === "signup" ? "Sign up" : "Sign In"}
        </div>
        <div className={`form-input-segment ${action}`}>
          {action === "signup" && (
            <>
              <FormControl
                id="authentication-firstname-input"
                variant="outlined"
              >
                <InputLabel htmlFor="authentication-firstname-input">
                  First Name
                </InputLabel>
                <OutlinedInput
                  type="text"
                  value={firstname}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                  label="Firstname"
                />
              </FormControl>
              <FormControl
                id="authentication-lastname-input"
                variant="outlined"
              >
                <InputLabel htmlFor="authentication-lastname-input">
                  Last Name
                </InputLabel>
                <OutlinedInput
                  type="text"
                  value={lastname}
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                  label="Lastname"
                />
              </FormControl>
            </>
          )}
          <InputWithError
            type="text"
            inputId="authentication-username-input"
            labelText="Username"
            value={username}
            setValue={setUsername}
            isValidFunc={validUsername}
            errorMessage={
              action === "signup"
                ? "Username must be between 6 and 16 characters long."
                : ""
            }
          />

          {action === "signup" && (
            <InputWithError
              type="text"
              inputId="authentication-email-input"
              labelText="Email"
              value={email}
              setValue={setEmail}
              isValidFunc={validEmail}
              errorMessage="Invalid Email"
            />
          )}
          <InputWithError
            type={"password"}
            inputId="authentication-password-input"
            labelText="Password"
            value={password}
            setValue={setPassword}
            isValidFunc={validPassword}
            errorMessage={
              action === "signup"
                ? "Password must be between 6 and 16 characters long."
                : action === "login" && wrongCredentials
                ? "Wrong Credentials, Please Try Again"
                : ""
            }
            showErrorOverride={wrongCredentials || undefined}
            browserAutoComplete={`${action === "signup" && "new-"}password`}
          />

          {action === "signup" && (
            <InputWithError
              type={"password"}
              inputId="authentication-passwordconfirm-input"
              labelText="Confirm Password"
              value={passwordconfirm}
              setValue={setPasswordConfirm}
              errorMessage="Passwords do not match."
              showErrorOverride={passwordsMismatch}
            />
          )}
          {action === "login" && (
            <>
              <span style={{ fontSize: "0.925rem" }}>
                {"Forgot your "}
                <span
                  className="text-button"
                  onClick={() => {
                    navigate("/forgot-credentials/username");
                  }}
                >
                  username
                </span>
                {" or "}
                <span
                  className="text-button"
                  onClick={() => {
                    navigate("/forgot-credentials/password");
                  }}
                >
                  password
                </span>
                {"?"}
              </span>
            </>
          )}
        </div>
        <div className="button-section">
          <LoadingButton
            className="main-button-1 primary"
            variant="contained"
            onClick={onSubmit}
            loading={disableButtons}
          >
            {action === "signup" ? "Sign Up" : "Sign In"}
          </LoadingButton>
          {showSignAsGuest && (
            <Button
              className="extra-button-1 secondary"
              variant="contained"
              onClick={() => navigate("/home")}
            >
              Continue as Guest
            </Button>
          )}
          {showOtherAuthOption && (
            <Button
              className="extra-button-2 secondary"
              variant="contained"
              onClick={() =>
                navigate(`/${action === "signup" ? "login" : "signup"}`)
              }
            >
              {action === "signup" ? "Sign In" : "Sign up"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
