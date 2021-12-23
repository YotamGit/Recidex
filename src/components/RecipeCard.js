import "../styles/RecipeCard.css";
import { Link } from "react-router-dom";
import Recipe from "./Recipe";
import { marked } from "marked";
import { useEffect } from "react";
import Button from "./Button";
import Chip from "@mui/material/Chip";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const RecipeCard = ({ recipe, onEditRecipe, deleteRecipe }) => {
  useEffect(() => {
    document.getElementById(recipe.id + "-recipe-description").innerHTML =
      marked.parse(recipe.description ? recipe.description : "");
  }, [recipe.description, recipe.id]);

  return (
    <div className="recipe-card">
      <Link className="recipe-btn" to={`/recipes/${recipe.id}`}>
        expand
      </Link>
      <div className="recipe" style={{ direction: recipe.rtl ? "rtl" : "ltr" }}>
        <div className="recipe-header">
          <div style={{ fontSize: "130%" }}>{recipe.title}</div>
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
        <div className="recipe-description-container">
          <div className="recipe-title">Description</div>
          <div
            className="recipe-text-box"
            id={recipe.id + "-recipe-description"}
          />
        </div>
        <div
          className="recipe-img"
          style={{ backgroundColor: "green", height: "60%", width: "100%" }}
        >
          IMAGE PLACEHOLDER
        </div>
        <div className="recipe-footer">
          <Link className="recipe-btn" to={`/recipes/edit/${recipe.id}`}>
            Edit
          </Link>

          <Button
            text="Delete"
            color="red"
            onClick={() => deleteRecipe(recipe.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
