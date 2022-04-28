import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";

import "../../styles/login/login.css";
import RecipesLogo from "../../utils-module/Photos/Recipes.svg";

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
  setFirstname,
  setLastname,
  setUserId,
} from "../../slices/usersSlice";

const Login = ({
  showSignAsGuest,
  showOtherAuthOption,
  navigateAfterLogin,
  onLogin,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [disableButtons, setDisableButtons] = useState(false);

  //detect enter key to sign in
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.code === "Enter") {
        onSubmitPassword();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password]);

  const onSubmitPassword = async () => {
    try {
      setDisableButtons(true);
      var result = await axios.post("/api/login", {
        username: username,
        password: password,
      });
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
        dispatch(setFirstname(result.data.userData.firstname));
        dispatch(setLastname(result.data.userData.lastname));
        dispatch(setSignedIn(true));
        if (navigateAfterLogin) {
          navigate("/home");
        }
        onLogin && onLogin(); //for closing login modal
      }
    } catch (error) {
      if (error.response.status === 401) {
        setWrongCredentials(true);
      } else {
        window.alert("Failed to Login.\nReason: " + error.message);
      }
    }
  };
  return (
    <div id="login-page">
      <img className="recipes-logo" src={RecipesLogo} alt=""></img>
      <div className="login-section">
        <div className="title">Sign in</div>
        <div className="form-input-segment">
          <FormControl variant="outlined">
            <InputLabel htmlFor="login-username-input">Username</InputLabel>
            <OutlinedInput
              id="login-username-input"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              label="Username"
              error={wrongCredentials ? true : false}
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="login-password-input">Password</InputLabel>
            <OutlinedInput
              id="login-password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              label="Password"
              error={wrongCredentials ? true : false}
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
            {wrongCredentials && (
              <span style={{ color: "red", fontSize: "13px" }}>
                Wrong Credentials, Please Try Again
              </span>
            )}
          </FormControl>
        </div>
        <div className="button-section">
          <LoadingButton
            className="main-button-1"
            variant="contained"
            onClick={onSubmitPassword}
            loading={disableButtons}
          >
            Sign In
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
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
