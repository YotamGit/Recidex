import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Signup.css";

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
import {
  setSignedIn,
  setUserId,
  setFirstname as setStoreFirstname,
  setLastname as setStoreLastname,
} from "../../slices/usersSlice";

const Signup = ({ showSignAsGuest, navigateAfterLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconfirm, setPasswordConfirm] = useState("");
  const [passwordsmismatch, setPasswordsMismatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitPassword = async () => {
    //check existance of required fields
    if (
      firstname === undefined ||
      lastname === undefined ||
      username === undefined ||
      password === undefined
    ) {
      //print error required fields
      window.alert("Please all of the fields.");
      return;
    }
    //confirm the user passwords
    if (password !== passwordconfirm) {
      setPasswordsMismatch(true);
      setPasswordConfirm("");
      return;
    }

    try {
      var result = await axios.post("/api/login/signup", {
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
      });
      if (result.data) {
        localStorage.setItem("userToken", result.data.token);
        dispatch(setUserId(result.data.userData.userId));
        dispatch(setStoreFirstname(firstname));
        dispatch(setStoreLastname(lastname));
        dispatch(setSignedIn(true));
        if (navigateAfterLogin) {
          navigate("/home");
        }
      }
    } catch (error) {
      if (error.response.status === 409) {
        window.alert("Failed to Sign Up.\nReason: " + error.response.data);
        localStorage.clear(); //not sure if required
        dispatch(setSignedIn(false)); //not sure if required
      } else {
        window.alert("Failed to Sign Up.\nReason: " + error.message);
      }
    }
  };
  return (
    <div id="signup-container">
      <div className="signup-form-input-segment">
        <h3 style={{ textAlign: "center" }}>Signup</h3>
        <div>
          <FormControl variant="outlined">
            <InputLabel htmlFor="signup-firstname-input">First Name</InputLabel>
            <OutlinedInput
              autoFocus
              id="signup-firstname-input"
              type="text"
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
              label="Firstname"
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="signup-lastname-input">Last Name</InputLabel>
            <OutlinedInput
              id="signup-lastname-input"
              type="text"
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
              label="Lastname"
            />
          </FormControl>
        </div>
        <div>
          <FormControl variant="outlined">
            <InputLabel htmlFor="signup-username-input">Username</InputLabel>
            <OutlinedInput
              id="signup-username-input"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              label="Username"
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="signup-password-input">Password</InputLabel>
            <OutlinedInput
              id="signup-password-input"
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
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="signup-passwordconfirm-input">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="signup-passwordconfirm-input"
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
            {passwordsmismatch && (
              <span style={{ color: "red", fontSize: "13px" }}>
                Passwords do not match, Please Try Again
              </span>
            )}
          </FormControl>
        </div>
        <Button variant="contained" onClick={onSubmitPassword}>
          Sign Up
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

export default Signup;
