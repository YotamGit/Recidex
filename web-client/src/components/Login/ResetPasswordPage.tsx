import "../../styles/login/ResetPasswordPage.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

import RecipesLogo from "../utilities/RecipesLogo";
import InputWithError from "../utilities/InputWithError";
import { validPassword } from "../../utils-module/validation";

//redux
import { useAppDispatch } from "../../hooks";
import { setAlert } from "../../slices/utilitySlice";

//mui
import LoadingButton from "@mui/lab/LoadingButton";
//types
import { FC } from "react";

const ResetPasswordPage: FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [passwordsMismatch, setPasswordsMismatch] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);

  useEffect(() => {
    if (passwordConfirm) {
      setPasswordsMismatch(password !== passwordConfirm);
    }
  }, [password, passwordConfirm]);

  const validateInput = () => {
    //check existance of required fields
    if (password === "" || passwordConfirm === "") {
      dispatch(
        setAlert({
          severity: "warning",
          title: "Warning",
          message: "Please fill all of the fields.",
        })
      );
      return false;
    }

    if (!validPassword(password)) {
      return false;
    }
    if (password !== passwordConfirm) {
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if (!validateInput()) {
      return;
    }

    setDisableButtons(true);
    try {
      let resetRes = await axios.post(`/api/users/user/reset-password`, {
        token: token,
        password,
      });

      dispatch(
        setAlert({
          severity: "success",
          title: "Success",
          message: "Password changed successfully",
        })
      );
      navigate("/login");
    } catch (err: any) {
      setDisableButtons(false);
      dispatch(
        setAlert({
          severity: "error",
          title: "Error",
          message: "Failed to reset password.",
          details: err.response.data ? err.response?.data : undefined,
        })
      );
    }
  };
  return (
    <div className="reset-password-page">
      <RecipesLogo />
      <div className="reset-password-container">
        <div className="title">{"Change Password"}</div>
        <div style={{ marginBottom: "0.5rem", whiteSpace: "pre-line" }}>
          {
            "Insert your new password.\nMake sure to remember it and keep it secure."
          }
        </div>
        <div className="input-section">
          <InputWithError
            inputId="reset-password-password-input"
            labelText="New Password"
            value={password}
            setValue={setPassword}
            isValidFunc={validPassword}
            errorMessage="Password must be between 6 and 16 characters long."
          />
          <InputWithError
            inputId="reset-password-passwordconfirm-input"
            labelText="Confirm Password"
            value={passwordConfirm}
            setValue={setPasswordConfirm}
            errorMessage="Passwords do not match."
            showErrorOverride={passwordsMismatch}
          />
        </div>
        <div className="button-container">
          <LoadingButton
            className={"primary"}
            variant="contained"
            loading={disableButtons}
            onClick={onSubmit}
          >
            Change Password
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
