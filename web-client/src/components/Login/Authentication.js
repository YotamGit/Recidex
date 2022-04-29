import "../../styles/login/Authentication.css";
import RecipesLogo from "../../utils-module/Photos/Recipes.svg";

//utils
import {
  validUsername,
  validPassword,
  validEmail,
} from "../../utils-module/validation";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import axios from "axios";

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
import { useDispatch } from "react-redux";
import {
  setSignedIn,
  setUserId,
  setFirstname as setStoreFirstname,
  setLastname as setStoreLastname,
} from "../../slices/usersSlice";

const Authentication = ({
  action,
  showSignAsGuest,
  showOtherAuthOption,
  navigateAfterLogin,
  onLogin,
}) => {
  const dispatch = useDispatch();
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
  const [wrongCredentials, setWrongCredentials] = useState(false);

  const [disableButtons, setDisableButtons] = useState(false);

  //detect enter key to sign up/in
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.code === "Enter") {
        onSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstname, lastname, email, username, password, passwordconfirm]);

  const validateInput = () => {
    //check existance of required fields
    if (
      firstname === "" ||
      lastname === "" ||
      email === "" ||
      username === "" ||
      password === ""
    ) {
      //print error required fields
      window.alert("Please fill all of the fields.");
      return false;
    }

    if (!validUsername(username)) {
      window.alert(
        "Invalid Username. \nUsername must be at least 6 characters long."
      );
      return false;
    }

    if (!validPassword(password)) {
      window.alert(
        "Invalid Password. \nPassword must be between 6 and 16 characters long."
      );
      return false;
    }

    if (!validEmail(email)) {
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
    if (action === "signup" && !validateInput()) {
      return;
    }
    try {
      setDisableButtons(true);
      var result = await axios.post(
        `/api/login${action === "signup" ? "/signup" : ""}`,
        {
          firstname: action === "signup" ? firstname : undefined,
          lastname: action === "signup" ? lastname : undefined,
          email: action === "signup" ? email : undefined,
          username: username,
          password: password,
        }
      );
      setDisableButtons(false);

      if (result.data) {
        var expiration_date = new Date();
        expiration_date.setFullYear(expiration_date.getFullYear() + 2);
        const cookies = new Cookies();
        cookies.set("userToken", result.data.token, {
          path: "/",
          expires: expiration_date,
          sameSite: "Strict",
        });
        dispatch(setUserId(result.data.userData.userId));
        dispatch(setStoreFirstname(result.data.userData.firstname));
        dispatch(setStoreLastname(result.data.userData.lastname));
        dispatch(setSignedIn(true));
        if (navigateAfterLogin) {
          navigate("/home");
        }
        onLogin && onLogin(); //for closing signup/login modal
      }
    } catch (error) {
      setDisableButtons(false);
      if (action === "login" && error.response.status === 401) {
        setWrongCredentials(true);
      } else {
        window.alert("Failed to Login.\nReason: " + error.message);
      }

      if (action === "signup" && error.response.status === 409) {
        window.alert("Failed to Sign Up.\nReason: " + error.response.data);
      } else {
        window.alert("Failed to Sign Up.\nReason: " + error.message);
      }
    }
  };
  return (
    <div id="authentication-page">
      <img className="recipes-logo" src={RecipesLogo} alt=""></img>
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

              <FormControl id="authentication-email-input" variant="outlined">
                <InputLabel htmlFor="authentication-email-input">
                  Email (password reset)
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
                  <span style={{ color: "red", fontSize: "13px" }}>
                    Invalid Email, Please Try Again
                  </span>
                )}
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
              <span style={{ color: "red", fontSize: "13px" }}>
                Wrong Credentials, Please Try Again
              </span>
            )}
          </FormControl>

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
            className="main-button-1"
            variant="contained"
            onClick={onSubmit}
            loading={disableButtons}
          >
            {action === "signup" ? "Sign Up" : "Sign In"}
          </LoadingButton>
          {showSignAsGuest && (
            <Button
              className="extra-button-1"
              variant="contained"
              onClick={() => navigate("/home")}
            >
              Continue as Guest
            </Button>
          )}
          {showOtherAuthOption && (
            <Button
              className="extra-button-2"
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
