import "../styles/RecipeCard.css";
import { Link } from "react-router-dom";
import { marked } from "marked";
import { useEffect } from "react";

//mui
import Chip from "@mui/material/Chip";

//icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const RecipeCard = ({ recipe, deleteRecipe }) => {
  useEffect(() => {
    document.getElementById(recipe._id + "-recipe-description").innerHTML =
      marked.parse(recipe.description ? recipe.description : "");
    if (recipe.image) {
      document.getElementById(recipe._id + "-recipe-card-image").src =
        recipe.image;
    }

    // resize description container if recipe has an image
    document.getElementById(recipe._id + "-recipe-card-image")
      ? (document.getElementById(
          recipe._id + "-recipe-card-description-container"
        ).style.height = "20%")
      : (document.getElementById(
          recipe._id + "-recipe-card-description-container"
        ).style.height = "70%");
  }, [recipe._id, recipe.description, recipe.image]);

  return (
    <div className="recipe-card">
      <div className="recipe">
        <div className="recipe-header">
          <div className="recipe-card-top-button-row">
            <Link
              to={`/recipes/${recipe._id}`}
              style={{ color: "gray", margin: "1%" }}
            >
              <OpenInFullRoundedIcon style={{ fontSize: "3.5vh" }} />
            </Link>
            <Link
              to={`/recipes/edit/${recipe._id}`}
              style={{ color: "gray", margin: "1%" }}
            >
              <EditRoundedIcon style={{ fontSize: "3.5vh" }} />
            </Link>
          </div>
          <div style={{ fontSize: "130%" }}>{recipe.title}</div>
          <div style={{ fontSize: "60%" }}>source: {recipe.source}</div>
          <div className="recipe-additional-data-container">
            <Chip
              className="recipe-additional-data"
              label={"Category: " + recipe.category}
            />
            <Chip
              className="recipe-additional-data"
              label={"Sub Category: " + recipe.sub_category}
            />
            <Chip
              className="recipe-additional-data"
              label={"Difficulty: " + recipe.difficulty}
            />
            <Chip
              className="recipe-additional-data"
              label={"Duration: " + recipe.duration}
            />
          </div>
        </div>
        <div
          className="recipe-card-description-container"
          id={recipe._id + "-recipe-card-description-container"}
          style={{
            direction: recipe.rtl ? "rtl" : "ltr",
          }}
        >
          <div className="recipe-title">
            {recipe.rtl ? "תיאור" : "Description"}
          </div>
          <div
            className="recipe-text-box"
            id={recipe._id + "-recipe-description"}
          />
        </div>
        {recipe.image && (
          <img
            className="recipe-card-image"
            id={recipe._id + "-recipe-card-image"}
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
