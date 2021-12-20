import { useEffect } from "react";
import { marked } from "marked";
import Button from "./Button";
import "../styles/Recipe.css";
import { Link } from "react-router-dom";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const Recipe = ({ recipe, onEditRecipe, deleteRecipe }) => {
  useEffect(() => {
    document.getElementById(recipe.id + "-recipe-description").innerHTML =
      marked.parse(recipe.description ? recipe.description : "");
    document.getElementById(recipe.id + "-recipe-ingredients").innerHTML =
      marked.parse(recipe.ingredients ? recipe.ingredients : "");
    document.getElementById(recipe.id + "-recipe-directions").innerHTML =
      marked.parse(recipe.directions ? recipe.directions : "");
  }, [recipe.description, recipe.ingredients, recipe.directions, recipe.id]);

  return (
    <div className="recipe" style={{ direction: recipe.rtl ? "rtl" : "ltr" }}>
      <div className="recipe-header">
        <div style={{ fontSize: "130%" }}>{recipe.title}</div>
        <div style={{ fontSize: "100%" }}>source: {recipe.source}</div>
      </div>
      <div className="recipe-section recipe-description-container">
        <div className="recipe-title">Description</div>
        <div
          className="recipe-text-box"
          id={recipe.id + "-recipe-description"}
        />
      </div>
      <div className="recipe-section">
        <div className="recipe-title">Ingredients</div>
        <div
          className="recipe-text-box"
          id={recipe.id + "-recipe-ingredients"}
        />
      </div>
      <div className="recipe-section">
        <div className="recipe-title">Directions</div>
        <div
          className="recipe-text-box"
          id={recipe.id + "-recipe-directions"}
        />
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
  );
};

export default Recipe;
