import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserProfileRecipesSection from "./UserProfileRecipesSection";

//mui icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

//mui
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";
import { TSelectedFilters } from "../../slices/filtersSlice";

const UserProfilePage: FC = () => {
  const navigate = useNavigate();

  const { user_id } = useParams();
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    axios
      .get(`/api/users/user/info/${user_id}`)
      .then((result) => setUserData(result.data));
  }, [user_id]);

  return (
    <>
      <div className="user-profile-page-top-button-row">
        <Tooltip title="Go back" arrow>
          <IconButton onClick={() => navigate(-1)}>
            <KeyboardBackspaceIcon className="icon" />
          </IconButton>
        </Tooltip>
      </div>
      {"TOP BUTTON ROW"}
      {JSON.stringify(userData)}
      <UserProfileRecipesSection user_id={user_id || ""} />
    </>
  );
};

export default UserProfilePage;
