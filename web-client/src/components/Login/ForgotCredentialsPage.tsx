import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../../styles/login/ForgotCredentialsPage.css";
import RecipesLogo from "../utilities/RecipesLogo";

import { useAppDispatch } from "../../hooks";
import { setAlert } from "../../slices/utilitySlice";
import InputWithError from "../utilities/InputWithError";

//utils
import { validUsername, validEmail } from "../../utils-module/validation";

//mui
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
    if (
      !(await validEmail(email)) ||
      (type === "password" && !validUsername(username))
    ) {
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
    } catch (err: any) {}
    setDisableButtons(false);
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
            <InputWithError
              inputId="forgot-credentials-username-input"
              labelText="Username"
              value={username}
              setValue={setUsername}
              isValidFunc={validUsername}
              errorMessage="Username must be between 6 and 16 characters long."
            />
          )}
          <InputWithError
            inputId="forgot-credentials-email-input"
            labelText="Email"
            value={email}
            setValue={setEmail}
            isValidFunc={validEmail}
            errorMessage="Invalid Email"
          />
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
          <div style={{ marginTop: "1rem", whiteSpace: "pre-line" }}>
            {type === "password"
              ? "If the username and email match, you'll receive an email with a link to reset your password.\n*The link will expire in 10 minutes."
              : "If there is an account associated with the email you'll receive an email with your username."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotCredentialsPage;
