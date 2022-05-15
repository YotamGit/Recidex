import "../../styles/recipes/RecipeCard.css";
import { Link, useNavigate } from "react-router-dom";
import { marked } from "marked";

import RecipeCardChips from "./RecipeCardChips";
import Favorite from "../buttons/Favorite";
import Share from "../buttons/Share";
import ImagePlaceholder from "../../utils-module/Photos/recipeImagePlaceholder.png";

//mui
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

//mui icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import FaceRoundedIcon from "@mui/icons-material/FaceRounded";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CookieOutlinedIcon from "@mui/icons-material/CookieOutlined";

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
}
const RecipeCard: FC<propTypes> = ({ recipe }) => {
  const navigate = useNavigate();

  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);

  return (
    <div className="recipe-card">
      <div className="recipe-card-top-button-row">
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
      <div className="recipe-body">
        <div className="recipe-header">
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
          <RecipeCardChips recipe={recipe} />
        </div>
        <div className="recipe-main-section">
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
          <div className="recipe-additional-data-and-image">
            <img
              className="recipe-card-image"
              src={
                recipe.imageName
                  ? `/api/recipes/image/${recipe._id}?${Date.now()}`
                  : ImagePlaceholder
              }
              style={
                !recipe.imageName && !fullscreen ? { height: "150px" } : {}
              }
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
              <div className="recipe-additional-data-field">
                <FaceRoundedIcon className="icon" />
                <Tooltip title="Owner" arrow>
                  <span className="data" dir="auto">
                    {recipe.owner &&
                      recipe.owner.firstname + " " + recipe.owner.lastname}
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="recipe-card-bottom-button-row">
        {recipe._id && recipe.favorited_by && (
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
