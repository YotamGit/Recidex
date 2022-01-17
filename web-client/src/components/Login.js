import React from "react";
import bcrypt from "bcryptjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import "../styles/login.css";

//mui
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

//mui icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { paperClasses } from "@mui/material";

// generate a hashed password
// var salt = await bcrypt.genSalt(10);
// var hash = await bcrypt.hash(plainPassword, salt);

const Login = ({ setSignedIn }) => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const autoLogin = async () => {
    const cookies = new Cookies();
    const passwordCookie = cookies.get("password");
    if (passwordCookie) {
      try {
        var result = await axios.get("/api/login");
        if (result.data) {
          setSignedIn(true);
          navigate("/home");
        } else {
          setSignedIn(false);
        }
      } catch (error) {
        window.alert("Failed to Login.\nReason: " + error.message);
      }
    }
  };
  useEffect(() => {
    autoLogin();
  }, []);

  const onSubmitPassword = async () => {
    const cookies = new Cookies();
    try {
      cookies.set("password", password, { path: "/" });
      var result = await axios.get("/api/login");
      if (result.data) {
        setSignedIn(true);
        navigate("/home");
      } else {
        setSignedIn(false);
        setWrongPassword(true);
      }
    } catch (error) {
      window.alert("Failed to Login.\nReason: " + error.message);
    }
  };
  return (
    <div id="login-container">
      <div className="login-form-input-segment">
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
            error={wrongPassword ? true : false}
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
          {wrongPassword && (
            <span style={{ color: "red", fontSize: "13px" }}>
              Wrong Password, Please Try Again
            </span>
          )}
        </FormControl>

        <Button variant="contained" onClick={onSubmitPassword}>
          Submit
        </Button>
        <Button style={{ color: "gray" }} onClick={() => navigate("/home")}>
          Continue as Guest
        </Button>
      </div>
    </div>
  );
};

export default Login;
