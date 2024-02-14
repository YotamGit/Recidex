import "../../styles/recipes/RecipeCard.css";
import { useNavigate,Link } from "react-router-dom";
import { marked } from "marked";

import RecipeCardChips from "./RecipeCardChips";
import Favorite from "../buttons/Favorite";
import Share from "../buttons/Share";
import ImagePlaceholder from "../../utils-module/Photos/recipeImagePlaceholder.svg";
import UserProfileLink from "../account/UserProfileLink";
import RecipeActionsMenuButton from "./RecipeActionsMenuButton";

//mui
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

//mui icons
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CookieOutlinedIcon from "@mui/icons-material/CookieOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import VpnLockRoundedIcon from "@mui/icons-material/VpnLockRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";

//redux
import { useAppSelector } from "../../hooks";

//types
import { TRecipe } from "../../slices/recipesSlice";
import { FC } from "react";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

interface propTypes {
  recipe: TRecipe;
  local?: {
    setRecipe?: (updatedRecipe: TRecipe) => void;
    chipsFilterFunction?: Function;
  };
}

const RecipeCard: FC<propTypes> = ({ recipe, local }) => {
  const navigate = useNavigate();

  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);

  return (
    <div className="recipe-card">
      <div className="recipe-card-top-button-row">
        <Tooltip title="Expand recipe" arrow>
          <IconButton onClick={() => navigate(`/recipes/${recipe._id}`)}>
            <OpenInFullRoundedIcon className="icon" />
          </IconButton>
        </Tooltip>

        {recipe.approved && (
          <Tooltip title="Approved" arrow>
            <VerifiedIcon
              className="icon"
              style={{ color: "rgb(125, 221, 112)" }}
            />
          </Tooltip>
        )}
        {recipe.private && (
          <Tooltip title="Private" arrow>
            <VpnLockRoundedIcon
              className="icon"
              style={{ color: "rgb(255, 93, 85)" }}
            />
          </Tooltip>
        )}
        {recipe.approval_required && (
          <Tooltip title="Pending Approval" arrow>
            <PendingRoundedIcon
              className="icon"
              style={{ color: "rgb(242, 147, 57)" }}
            />
          </Tooltip>
        )}

        <RecipeActionsMenuButton recipe={recipe} local={local} />
      </div>
      <div className="recipe-header">
        <Link
          className="recipe-title link-reset"
          to={`/recipes/${recipe._id}`}
        >
          {recipe.title}
        </Link>
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
      </div>
      <div className="recipe-body">
        <RecipeCardChips
          recipe={recipe}
          chipsFilterFunction={local?.chipsFilterFunction}
        />
        {recipe.description && (
          <div
            className="recipe-description"
            style={{
              direction: recipe.rtl ? "rtl" : "ltr",
            }}
            dangerouslySetInnerHTML={{
              __html: marked.parse(
                recipe.description ? recipe.description : ""
              ),
            }}
          />
        )}
        <img
          className={`recipe-card-image ${
            !recipe.imageName ? "placeholder" : ""
          }`}
          src={
            recipe.imageName
              ? `/api/recipes/image/${recipe._id}?${Date.now()}`
              : ImagePlaceholder
          }
          style={!recipe.imageName && !fullscreen ? { height: "150px" } : {}}
          alt=""
          onClick={() => navigate(`/recipes/${recipe._id}`)}
        />
        <div className="recipe-additional-data">
          {recipe.total_time && (
            <div className="recipe-additional-data-field">
              <AccessTimeOutlinedIcon className="icon" />
              <Tooltip title="Total Time" arrow>
                <span className="data">{recipe.total_time}</span>
              </Tooltip>
            </div>
          )}
          {recipe.servings && (
            <div className="recipe-additional-data-field">
              <CookieOutlinedIcon className="icon" />
              <Tooltip title="Servings" arrow>
                <span className="data" dir="auto">
                  {recipe.servings}
                </span>
              </Tooltip>
            </div>
          )}
          {recipe.owner && <UserProfileLink owner={recipe.owner} />}
        </div>
      </div>
      <div className="recipe-card-bottom-button-row">
        {!recipe.private && recipe._id && recipe.favorited_by && (
          <Favorite
            recipeId={recipe._id}
            favorited_by={recipe.favorited_by}
            showCount={true}
          />
        )}
        <Share
          url={`${window.location.origin}/recipes/${recipe._id}`}
          emailTitle={recipe.title}
        />
      </div>
    </div>
  );
};

export default RecipeCard;
