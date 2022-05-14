import "../../styles/recipe_moderation/ModerationRecipeCard.css";

import { Link, useNavigate } from "react-router-dom";
import { marked } from "marked";

//mui
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

//mui icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import FaceRoundedIcon from "@mui/icons-material/FaceRounded";

//redux
import { useAppDispatch } from "../../hooks";
import { approveRecipe } from "../../slices/recipesSlice";

//types
import { TRecipe } from "../../slices/recipesSlice";
import { FC } from "react";

interface propTypes {
  recipe: TRecipe;
}
const ModerationRecipeCard: FC<propTypes> = ({ recipe }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onApprove = async (approve: boolean) => {
    let confirm = window.confirm(
      `${approve ? "Approve" : "Disapprove"} recipe ${recipe.title}?`
    );
    if (confirm) {
      await dispatch(
        approveRecipe({ _id: recipe._id as string, approve: approve })
      );
    }
  };

  return (
    <div className="moderation-recipe-card">
      <div className="top-button-row">
        <Link
          to={`/recipes/${recipe._id}`}
          style={{ color: "gray", margin: "1%" }}
        >
          <Tooltip title="Expand recipe" arrow>
            <OpenInFullRoundedIcon className="icon" />
          </Tooltip>
        </Link>
        <Link
          to={`/recipes/edit/${recipe._id}`}
          style={{ color: "gray", margin: "1%" }}
        >
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
      <div className="owner-field">
        <FaceRoundedIcon className="icon" />
        <span className="data" dir="auto">
          {recipe.owner && recipe.owner.firstname + " " + recipe.owner.lastname}
        </span>
      </div>
      <div className="bottom-button-row">
        <Button
          className="approve-button"
          variant="contained"
          style={{ backgroundColor: "rgb(72, 206, 72)" }}
          onClick={() => onApprove(true)}
        >
          approve
        </Button>
        <Button
          className="approve-button"
          variant="contained"
          style={{ backgroundColor: "rgb(206, 78, 72)" }}
          onClick={() => onApprove(false)}
        >
          disapprove
        </Button>
      </div>
    </div>
  );
};

export default ModerationRecipeCard;
