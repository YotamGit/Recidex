import "../../styles/recipes/RecipeCard.css";
import { Link, useNavigate } from "react-router-dom";
import { marked } from "marked";
import { useEffect, useState } from "react";

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
import { useSelector, useDispatch } from "react-redux";
import { setFilters, setFiltered } from "../../slices/filtersSlice";
import { getRecipes } from "../../slices/recipesSlice";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const RecipeCard = ({ recipe }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fullscreen = useSelector((state) => state.utilities.fullscreen);

  const chipCategoryOnClick = async () => {
    dispatch(
      setFilters({
        category: recipe.category,
        sub_category: undefined,
        difficulty: undefined,
        prep_time: undefined,
        total_time: undefined,
      })
    );
    var filterRes = await dispatch(getRecipes({ replace: true, args: {} }));
    if (!filterRes.error) {
      dispatch(setFiltered(true));
    }
  };
  const chipSubCategoryOnClick = async () => {
    dispatch(
      setFilters({
        category: recipe.category,
        sub_category: recipe.sub_category,
        difficulty: undefined,
        prep_time: undefined,
        total_time: undefined,
      })
    );
    var filterRes = await dispatch(getRecipes({ replace: true, args: {} }));
    if (!filterRes.error) {
      dispatch(setFiltered(true));
    }
  };
  const chipDifficultyOnClick = async () => {
    dispatch(
      setFilters({
        category: undefined,
        sub_category: undefined,
        difficulty: recipe.difficulty,
        prep_time: undefined,
        total_time: undefined,
      })
    );
    var filterRes = await dispatch(getRecipes({ replace: true, args: {} }));
    if (!filterRes.error) {
      dispatch(setFiltered(true));
    }
  };

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
          <div>
            <span
              className="recipe-title"
              onClick={() => navigate(`/recipes/${recipe._id}`)}
            >
              {recipe.title}
            </span>
          </div>
          <div className="recipe-data-dates">
            <span className="recipe-data-date">
              <span>Created: </span>
              {new Date(recipe.creation_time).toLocaleString("he-IL", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </span>

            <Divider orientation="vertical" variant="middle" />
            <span className="recipe-data-date">
              <span>Updated: </span>
              {new Date(recipe.last_update_time).toLocaleString("he-IL", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <Divider variant="middle" />
          <div className="recipe-data-chips">
            {recipe.category && (
              <Tooltip title="Filter category" arrow>
                <Chip
                  className="recipe-data-chip"
                  label={recipe.category}
                  onClick={chipCategoryOnClick}
                />
              </Tooltip>
            )}
            {recipe.sub_category && (
              <Tooltip title="Filter sub category" arrow>
                <Chip
                  className="recipe-data-chip"
                  label={recipe.sub_category}
                  onClick={chipSubCategoryOnClick}
                />
              </Tooltip>
            )}
            {recipe.difficulty && (
              <Tooltip title="Filter difficulty" arrow>
                <Chip
                  className="recipe-data-chip"
                  label={recipe.difficulty}
                  onClick={chipDifficultyOnClick}
                />
              </Tooltip>
            )}
          </div>
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
                    {recipe.owner.firstname + " " + recipe.owner.lastname}
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="recipe-card-bottom-button-row">
        <Favorite
          recipeId={recipe._id}
          favorited_by={recipe.favorited_by}
          showCount={true}
        />
        <Share
          url={`${window.location.origin}/recipes/${recipe._id}`}
          emailTitle={recipe.title}
        />
      </div>
    </div>
  );
};

export default RecipeCard;
