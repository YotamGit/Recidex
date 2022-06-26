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

//mui

import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

//mui icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
  const [showPassword, setShowPassword] = useState(false);

  const [invalidEmail, setInvalidEmail] = useState(false);
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

    if (!validUsername(username)) {
      return false;
    }

    if (!validPassword(password)) {
      return false;
    }

    if (!(await validEmail(email))) {
      setInvalidEmail(true);
      return false;
    } else {
      setInvalidEmail(false);
    }

    //confirm the user passwords
    if (password !== passwordconfirm) {
      setPasswordsMismatch(true);
      setPasswordConfirm("");
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
          <FormControl id="authentication-username-input" variant="outlined">
            <InputLabel htmlFor="authentication-username-input">
              Username
            </InputLabel>
            <OutlinedInput
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              label="Username"
            />
          </FormControl>
          {action === "signup" && (
            <FormControl id="authentication-email-input" variant="outlined">
              <InputLabel htmlFor="authentication-email-input">
                Email
              </InputLabel>
              <OutlinedInput
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                label="Email"
              />
              {invalidEmail && (
                <span style={{ color: "red", fontSize: "0.8rem" }}>
                  Invalid Email, Please Try Again
                </span>
              )}
            </FormControl>
          )}
          <FormControl id="authentication-password-input" variant="outlined">
            <InputLabel htmlFor="authentication-password-input">
              Password
            </InputLabel>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              label="Password"
              autoComplete={`${action === "signup" && "new-"}password`}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="start"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {action === "login" && wrongCredentials && (
              <span style={{ color: "red", fontSize: "0.8rem" }}>
                Wrong Credentials, Please Try Again
              </span>
            )}
          </FormControl>

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

          {action === "signup" && (
            <>
              <FormControl
                id="authentication-passwordconfirm-input"
                variant="outlined"
              >
                <InputLabel htmlFor="authentication-passwordconfirm-input">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  value={passwordconfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                  }}
                  label="Password Confirm"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="start"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {passwordsMismatch && (
                  <span style={{ color: "red", fontSize: "13px" }}>
                    Passwords do not match, Please Try Again
                  </span>
                )}
              </FormControl>
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
