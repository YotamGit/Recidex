import "../../styles/account/UserProfilePage.css";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserProfileRecipesSection from "./UserProfileRecipesSection";
import UserProfileInfoSection from "./UserProfileInfoSection";
import PageTitle from "../PageTitle";
import { isUserExist } from "../../utils-module/users";

//mui icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

//mui
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

//types
import { FC } from "react";

const UserProfilePage: FC = () => {
  const navigate = useNavigate();

  const { user_id } = useParams();
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    if (user_id) {
      isUserExist(user_id).then((res: boolean) => setUserExists(res));
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
      <PageTitle />
      {userExists && (
        <>
          <UserProfileInfoSection userId={user_id || ""} />
          <UserProfileRecipesSection userId={user_id || ""} />
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
