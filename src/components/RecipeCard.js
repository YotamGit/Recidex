import "../styles/RecipeCard.css";
import { Link } from "react-router-dom";
import { marked } from "marked";
import { useEffect } from "react";

//mui
import Chip from "@mui/material/Chip";

//icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const RecipeCard = ({ recipe, onEditRecipe, deleteRecipe }) => {
  useEffect(() => {
    document.getElementById(recipe.id + "-recipe-description").innerHTML =
      marked.parse(recipe.description ? recipe.description : "");
    if (recipe.image) {
      document.getElementById(recipe.id + "-recipe-card-image").src =
        window.URL.createObjectURL(recipe.image);
    }

    // resize description container if recipe has an image
    document.getElementById(recipe.id + "-recipe-card-image")
      ? (document.getElementById(
          recipe.id + "-recipe-card-description-container"
        ).style.height = "20%")
      : (document.getElementById(
          recipe.id + "-recipe-card-description-container"
        ).style.height = "70%");
  }, [recipe.id, recipe.description, recipe.image]);

  return (
    <div className="recipe-card">
      <div className="recipe">
        <div className="recipe-header">
          <div className="recipe-card-top-button-row">
            <Link
              to={`/recipes/${recipe.id}`}
              style={{ color: "gray", margin: "1%" }}
            >
              <OpenInFullRoundedIcon style={{ fontSize: "3.5vh" }} />
            </Link>
            <DeleteForeverRoundedIcon
              style={{
                color: "red",
                margin: "1%",
                fontSize: "3.5vh",
                cursor: "pointer",
              }}
              onClick={() => deleteRecipe(recipe.id)}
            />
          </div>
          <div style={{ fontSize: "130%" }}>
            {recipe.title}
            <Link to={`/recipes/edit/${recipe.id}`}>
              <EditRoundedIcon
                style={{ color: "gray", marginLeft: "1%", fontSize: "3vh" }}
              />
            </Link>
          </div>
          <div style={{ fontSize: "60%" }}>source: {recipe.source}</div>
          <div className="recipe-additional-data-container">
            <Chip
              className="recipe-additional-data"
              label={"Category: " + recipe.category}
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
          id={recipe.id + "-recipe-card-description-container"}
          style={{
            direction: recipe.rtl ? "rtl" : "ltr",
          }}
        >
          <div className="recipe-title">Description</div>
          <div
            className="recipe-text-box"
            id={recipe.id + "-recipe-description"}
          />
        </div>
        {recipe.image && (
          <img
            className="recipe-card-image"
            id={recipe.id + "-recipe-card-image"}
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
