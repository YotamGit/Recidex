import "../../styles/account/UserProfilePage.css";
import { useNavigate, useParams } from "react-router-dom";
import UserProfileRecipesSection from "./UserProfileRecipesSection";
import UserProfileInfoSection from "./UserProfileInfoSection";

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

  return (
    <div className="user-profile-page">
      <div className="user-profile-page-top-button-row">
        <Tooltip title="Go back" arrow>
          <IconButton onClick={() => navigate(-1)}>
            <KeyboardBackspaceIcon className="icon" />
          </IconButton>
        </Tooltip>
      </div>

      {/* <UserProfileInfoSection user_id={"dfsdfsdfsdf"} />
      <UserProfileRecipesSection user_id={"asdasdasd"} /> */}
      <UserProfileInfoSection user_id={user_id || ""} />
      <UserProfileRecipesSection user_id={user_id || ""} />
    </div>
  );
};

export default UserProfilePage;
