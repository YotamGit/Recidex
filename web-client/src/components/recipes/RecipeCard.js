import "../../styles/recipes/RecipeCard.css";
import { Link, useNavigate } from "react-router-dom";
import { marked } from "marked";
import { useEffect } from "react";

import Favorite from "../Favorite";
import ImagePlaceholder from "../../utils-module/Photos/recipeImagePlaceholder.png";

//mui
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

//icons
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

  const signedIn = useSelector((state) => state.users.signedIn);
  const fullscreen = useSelector((state) => state.utilities.fullscreen);

  useEffect(() => {
    document.getElementById(recipe._id + "-recipe-description").innerHTML =
      marked.parse(recipe.description ? recipe.description : "");
    if (recipe.image) {
      document.getElementById(recipe._id + "-recipe-card-image").src =
        recipe.image;
    }
  }, [recipe._id, recipe.description, recipe.image]);

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
        category: undefined,
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
          <OpenInFullRoundedIcon className="icon" />
        </Link>
        <Link
          to={`/recipes/edit/${recipe._id}`}
          style={{ color: "gray", margin: "1%" }}
        >
          <EditRoundedIcon className="icon" />
        </Link>
      </div>
      <div className="recipe">
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
              <Chip
                className="recipe-data-chip"
                label={recipe.category}
                onClick={chipCategoryOnClick}
              />
            )}
            {recipe.sub_category && (
              <Chip
                className="recipe-data-chip"
                label={recipe.sub_category}
                onClick={chipSubCategoryOnClick}
              />
            )}
            {recipe.difficulty && (
              <Chip
                className="recipe-data-chip"
                label={recipe.difficulty}
                onClick={chipDifficultyOnClick}
              />
            )}
          </div>
        </div>
        <div className="recipe-main-section">
          <div
            className="recipe-description"
            id={recipe._id + "-recipe-description"}
            style={{
              direction: recipe.rtl ? "rtl" : "ltr",
            }}
          />
          <div className="recipe-additional-data-and-image">
            <img
              className="recipe-card-image"
              src={ImagePlaceholder}
              style={!recipe.image && !fullscreen ? { height: "150px" } : {}}
              id={recipe._id + "-recipe-card-image"}
              alt=""
            />
            <div className="recipe-additional-data">
              {recipe.total_time && (
                <div className="recipe-additional-data-field">
                  <AccessTimeOutlinedIcon className="icon" />
                  <span className="data">{recipe.total_time}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="recipe-additional-data-field">
                  <CookieOutlinedIcon className="icon" />
                  <span className="data">{recipe.servings}</span>
                </div>
              )}
              <div className="recipe-additional-data-field">
                <FaceRoundedIcon className="icon" />
                <span className="data">
                  {recipe.owner.firstname + " " + recipe.owner.lastname}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="recipe-card-bottom-button-row">
        {signedIn && (
          <Favorite recipeId={recipe._id} favorited_by={recipe.favorited_by} />
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
