import { useEffect } from "react";
import RecipeEditor from "./RecipeEditor";
import Popup from "reactjs-popup";
import "../styles/Recipe.css";
import { marked } from "marked";
import Button from "./Button";

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
        <h1>{recipe.title}</h1>
        <h3>source: {recipe.source}</h3>
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
      <Popup trigger={<button>Edit Recipe</button>} modal nested>
        {(close) => (
          <>
            <button onClick={close}>&times;</button>
            <RecipeEditor
              key={recipe.id}
              recipe={recipe}
              onEditRecipe={onEditRecipe}
              close={close}
            />
          </>
        )}
      </Popup>
      <Button
        text="Delete"
        color="red"
        onClick={() => deleteRecipe(recipe.id)}
      />
    </div>
  );
};

export default Recipe;
