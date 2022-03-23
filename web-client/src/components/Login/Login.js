import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import "../../styles/login.css";

// generate a hashed password
// import bcrypt from "bcryptjs";
// var salt = await bcrypt.genSalt(10);
// var hash = await bcrypt.hash(plainPassword, salt);

//mui

import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

//mui icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//redux
import { useDispatch } from "react-redux";
import { setSignedIn } from "../../slices/usersSlice";

const Login = ({ showSignAsGuest, navigateAfterLogin, onLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const autoLogin = async () => {
    const cookies = new Cookies();
    const passwordCookie = cookies.get("password"); //get the token instead of the password
    if (passwordCookie) {
      try {
        var result = await axios.post("/api/login");
        if (result.data) {
          dispatch(setSignedIn(result));

          if (navigateAfterLogin) {
            navigate("/home");
          }
        }
      } catch (error) {
        if (error.response.status === 401) {
          dispatch(setSignedIn(false));
        } else {
          window.alert(
            "Error Trying to Log In Automatically.\nReason: " + error.message
          );
        }
      }
    }
  };
  useEffect(() => {
    autoLogin();
  }, []);

  const onSubmitPassword = async () => {
    const cookies = new Cookies();
    try {
      //set the token received from the server instead of straight up the password
      cookies.set("password", password, {
        path: "/",
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
      });
      var result = await axios.post("/api/login", {
        username: username,
        password: password,
      });
      if (result.data) {
        dispatch(setSignedIn(true));
        if (navigateAfterLogin) {
          navigate("/home");
        }
        onLogin && onLogin();
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        dispatch(setSignedIn(false));
        setWrongCredentials(true);
      } else {
        window.alert("Failed to Login.\nReason: " + error.message);
      }
    }
  };
  return (
    <div id="login-container">
      <div className="login-form-input-segment">
        <h3 style={{ textAlign: "center" }}>Login</h3>
        <FormControl variant="outlined">
          <InputLabel htmlFor="login-username-input">Username</InputLabel>
          <OutlinedInput
            autoFocus
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
            autoFocus
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

        <Button variant="contained" onClick={onSubmitPassword}>
          Sign In
        </Button>
        {showSignAsGuest && (
          <Button style={{ color: "gray" }} onClick={() => navigate("/home")}>
            Continue as Guest
          </Button>
        )}
      </div>
    </div>
  );
};

export default Login;
