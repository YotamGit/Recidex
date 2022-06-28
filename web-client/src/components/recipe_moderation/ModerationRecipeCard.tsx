import "../../styles/recipe_moderation/ModerationRecipeCard.css";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import UserProfileLink from "../account/UserProfileLink";
import RecipeModerationButton from "./RecipeModerationButton";

//mui
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

//mui icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";

//types
import { TRecipe } from "../../slices/recipesSlice";
import { FC } from "react";

interface propTypes {
  recipe: TRecipe;
}
const ModerationRecipeCard: FC<propTypes> = ({ recipe }) => {
  const navigate = useNavigate();

  const [disableButton, setDisableButton] = useState(false);

  return (
    <div className="moderation-recipe-card">
      <div className="top-button-row" style={{ margin: "1%" }}>
        <Link to={`/recipes/${recipe._id}`} style={{ lineHeight: 0 }}>
          <Tooltip title="Expand recipe" arrow>
            <OpenInFullRoundedIcon className="icon" />
          </Tooltip>
        </Link>
        <Link to={`/recipes/edit/${recipe._id}`} style={{ lineHeight: 0 }}>
          <Tooltip title="Edit recipe" arrow>
            <EditRoundedIcon className="icon" />
          </Tooltip>
        </Link>
      </div>
      <div
        className="recipe-title"
        onClick={() => navigate(`/recipes/${recipe._id}`)}
      >
        {recipe.title}
      </div>
      <div className="recipe-data-dates">
        <span className="recipe-data-date">
          <span>Created: </span>
          {recipe.creation_time &&
            new Date(recipe.creation_time).toLocaleString("he-IL", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
        </span>

        <Divider orientation="vertical" variant="middle" />
        <span className="recipe-data-date">
          <span>Updated: </span>
          {recipe.last_update_time &&
            new Date(recipe.last_update_time).toLocaleString("he-IL", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
        </span>
      </div>
      <Divider variant="middle" />

      {recipe.owner && <UserProfileLink owner={recipe.owner} />}
      <div className="bottom-button-row">
        <RecipeModerationButton
          kind="disapprove"
          type="button"
          recipe={recipe}
          setDisabled={setDisableButton}
          disabled={disableButton}
          fromModerationPage={true}
        />
        <RecipeModerationButton
          kind="approve"
          type="button"
          recipe={recipe}
          setDisabled={setDisableButton}
          disabled={disableButton}
          fromModerationPage={true}
        />
      </div>
    </div>
  );
};

export default ModerationRecipeCard;
