import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../../styles/login/ForgotCredentialsPage.css";
import RecipesLogo from "../../utils-module/Photos/Recipes.svg";

import { useAppDispatch } from "../../hooks";
import { setAlert } from "../../slices/utilitySlice";
import InputTextError from "../InputTextError";

//utils
import { validUsername, validEmail } from "../../utils-module/validation";

//mui
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

//types
import { FC } from "react";

const ForgotCredentialsPage: FC = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidUsername, setInvalidUsername] = useState(false);

  const [disableButtons, setDisableButtons] = useState(false);

  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!["password", "username"].includes(type || "")) {
      navigate("/");
    }
  }, [type]);

  //detect enter key to sign up/in
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        onSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, username]);

  const validateInput = async () => {
    //check existance of required fields
    if (
      (type === "password" && (email === "" || username === "")) ||
      (type === "username" && email === "")
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
    if (invalidEmail || invalidUsername) {
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if (!(await validateInput())) {
      return;
    }
    setDisableButtons(true);
    try {
      let forgotRes = await axios.post(`/api/users/user/forgot-${type}`, {
        userData: {
          email,
          username: type === "password" ? username : undefined,
        },
      });
      setEmailSent(true);
      setDisableButtons(false);
    } catch (err: any) {
      setDisableButtons(false);
    }
  };
  return (
    <div className="forgot-credentials-page">
      <img
        onClick={() => navigate("/home")}
        className="recipes-logo"
        src={RecipesLogo}
        alt=""
      ></img>

      {type === "password" && (
        <div className="input-section">
          <FormControl id="forgot-credentials-email-input" variant="outlined">
            <InputLabel htmlFor="forgot-credentials-email-input">
              Email
            </InputLabel>
            <OutlinedInput
              type="text"
              value={email}
              onChange={async (e) => {
                setEmail(e.target.value);
                setInvalidEmail(!(await validEmail(e.target.value)));
              }}
              label="Email"
            />
            <InputTextError
              showError={invalidEmail}
              message={"Invalid Email"}
            />
          </FormControl>

          <FormControl
            id="forgot-credentials-username-input"
            variant="outlined"
          >
            <InputLabel htmlFor="forgot-credentials-username-input">
              Username
            </InputLabel>
            <OutlinedInput
              type="text"
              value={username}
              onChange={async (e) => {
                setUsername(e.target.value);
                setInvalidUsername(!validUsername(e.target.value));
              }}
              label="Username"
            />
            <InputTextError
              showError={invalidUsername}
              message={"Username must be between 6 and 16 characters long."}
            />
          </FormControl>
        </div>
      )}
      <LoadingButton
        className={"primary"}
        variant="contained"
        disabled={emailSent}
        loading={disableButtons}
        onClick={onSubmit}
      >
        {type === "password" ? "Reset Password" : "Get Username"}
      </LoadingButton>
    </div>
  );
};

export default ForgotCredentialsPage;
