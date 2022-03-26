import "../../styles/recipes/RecipeCard.css";
import { Link, useNavigate } from "react-router-dom";
import { marked } from "marked";
import { useEffect } from "react";

//mui
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

//icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";

//redux
import { useSelector } from "react-redux";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById(recipe._id + "-recipe-description").innerHTML =
      marked.parse(recipe.description ? recipe.description : "");
    if (recipe.image) {
      document.getElementById(recipe._id + "-recipe-card-image").src =
        recipe.image;
    }
  }, [recipe._id, recipe.description, recipe.image]);

  return (
    <div className="recipe-card">
      <div className="recipe-card-top-button-row">
        <Link
          to={`/recipes/${recipe._id}`}
          style={{ color: "gray", margin: "1%" }}
        >
          <OpenInFullRoundedIcon style={{ fontSize: "30px" }} />
        </Link>
        <Link
          to={`/recipes/edit/${recipe._id}`}
          style={{ color: "gray", margin: "1%" }}
        >
          <EditRoundedIcon style={{ fontSize: "30px" }} />
        </Link>
      </div>
      <div
        className="recipe"
        onClick={() => navigate(`/recipes/${recipe._id}`)}
      >
        <div className="recipe-header">
          <div className="recipe-title">{recipe.title}</div>

          <div className="recipe-data-dates">
            <span className="recipe-data-date">
              <span>Creation: </span>
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
              <Chip className="recipe-data-chip" label={recipe.category} />
            )}
            {recipe.sub_category && (
              <Chip className="recipe-data-chip" label={recipe.sub_category} />
            )}
            {recipe.difficulty && (
              <Chip className="recipe-data-chip" label={recipe.difficulty} />
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
            <span className="recipe-additional-data">
              {recipe.prep_time && (
                <div className="recipe-additional-data-field">
                  <span className="caption">Prep Time:</span>
                  <span>{recipe.prep_time}</span>
                </div>
              )}
              {recipe.total_time && (
                <div className="recipe-additional-data-field">
                  <span className="caption">Total Time:</span>
                  <span>{recipe.total_time}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="recipe-additional-data-field">
                  <span className="caption">Servings:</span>
                  <span>{recipe.servings}</span>
                </div>
              )}
              {recipe.source && (
                <div className="recipe-additional-data-field">
                  <span className="caption">Source:</span>
                  <span>{recipe.source}</span>
                </div>
              )}
              <div className="recipe-additional-data-field">
                <span className="caption">Owner:</span>
                <span>
                  {recipe.owner.firstname + " " + recipe.owner.lastname}
                </span>
              </div>
            </span>
            {recipe.image && (
              <img
                className="recipe-card-image"
                id={recipe._id + "-recipe-card-image"}
                alt=""
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
