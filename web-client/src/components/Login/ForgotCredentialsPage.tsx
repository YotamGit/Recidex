import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../../styles/login/ForgotCredentialsPage.css";
import RecipesLogo from "../RecipesLogo";

import { useAppDispatch } from "../../hooks";
import { setAlert } from "../../slices/utilitySlice";
import InputTextError from "../InputTextError";

//utils
import { validUsername, validEmail } from "../../utils-module/validation";

//mui
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
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

  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (!["password", "username"].includes(type || "")) {
      navigate("/");
    }
    setEmail("");
    setUsername("");
    setRequestSent(false);
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
      setRequestSent(true);
      setDisableButtons(false);
    } catch (err: any) {
      setDisableButtons(false);
    }
  };
  return (
    <div className="forgot-credentials-page">
      <RecipesLogo />
      <div className="forgot-credentials-container">
        <div className="title">
          {type === "password" ? "Reset Password" : "Recover Username"}
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          {type === "password"
            ? "Insert the username and email associated with your Recipes account and we'll send you an email with a link to reset your password."
            : "Insert the email associated with your Recipes account and we'll' send you an email with your username."}
        </div>
        <div className="input-section">
          {type === "password" && (
            <>
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
            </>
          )}
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
        </div>
        <div className="button-container">
          <LoadingButton
            className={"primary"}
            variant="contained"
            disabled={requestSent}
            loading={disableButtons}
            onClick={onSubmit}
          >
            {type === "password" ? "Reset Password" : "Get Username"}
          </LoadingButton>
          <Button
            variant="text"
            onClick={() =>
              navigate(
                `/forgot-credentials/${
                  type === "password" ? "username" : "password"
                }`
              )
            }
          >
            {type === "password" ? "forgot username?" : "forgot password?"}
          </Button>
        </div>
        {requestSent && (
          <div style={{ marginTop: "1rem" }}>
            {type === "password"
              ? "If the username and email match, you'll receive an email with a link to reset your password."
              : "If there is an account associated with the email you'll receive an email with your username."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotCredentialsPage;
