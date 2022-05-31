import "../../styles/account/UserProfilePage.css";
import axios from "axios";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserProfileRecipesSection from "./UserProfileRecipesSection";
import UserProfileInfoSection from "./UserProfileInfoSection";

//mui icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

//mui
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

//redux
import { useAppDispatch } from "../../hooks";
import { setAlert } from "../../slices/utilitySlice";

//types
import { FC } from "react";

const UserProfilePage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user_id } = useParams();
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const isUserExist = async () => {
      try {
        var result = await axios.get(`/api/users/user/exists/${user_id}`);
        setUserExists(result.data);

        if (!result.data) {
          dispatch(
            setAlert({
              severity: "error",
              title: "Error",
              message: "Failed to Fetch User Info.",
              details: "User not found",
            })
          );
        }
      } catch (err: any) {
        setUserExists(false);
        dispatch(
          setAlert({
            severity: "error",
            title: "Error",
            message: "Failed to Fetch User Info.",
            details: err.response.data ? err.response.data : undefined,
          })
        );
      }
    };

    if (user_id) {
      isUserExist();
    }
  }, [user_id]);

  return (
    <div className="user-profile-page">
      <div className="user-profile-page-top-button-row">
        <Tooltip title="Go back" arrow>
          <IconButton onClick={() => navigate(-1)}>
            <KeyboardBackspaceIcon className="icon" />
          </IconButton>
        </Tooltip>
      </div>
      {userExists && (
        <>
          <UserProfileInfoSection user_id={user_id || ""} />
          <UserProfileRecipesSection user_id={user_id || ""} />
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
