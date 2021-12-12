import { useState, useEffect } from "react";
import RecipeEditor from "./RecipeEditor";
import Popup from "reactjs-popup";
import "../styles/Recipe.css";
import { marked } from "marked";

const Recipe = () => {
  const [description, setDescription] = useState(
    "I made up this recipe many years ago, because I loved the corn dogs you buy at carnivals but could not find a recipe for them. Great served with mustard. "
  );
  const [ingredients, setIngredients] = useState("");
  const [directions, setDirections] = useState("");
  const [recipeTitle, setTitle] = useState("Corn Dogs");

  useEffect(() => {
    document.getElementById("recipe-description").innerHTML =
      marked.parse(description);
    document.getElementById("recipe-ingredients").innerHTML =
      marked.parse(ingredients);
    document.getElementById("recipe-directions").innerHTML =
      marked.parse(directions);
  }, [description, ingredients, directions]);

  return (
    <div className="recipe">
      <h1 style={{ textAlign: "center" }}>{recipeTitle}</h1>
      <div>
        <div className="recipe-title">Description</div>
        <div className="recipe-text-box" id="recipe-description"></div>
      </div>
      <div>
        <div className="recipe-title">Ingredients</div>
        <div className="recipe-text-box" id="recipe-ingredients"></div>
      </div>
      <div>
        <div className="recipe-title">Directions</div>
        <div className="recipe-text-box" id="recipe-directions"></div>
      </div>
      <Popup trigger={<button>Edit Recipe</button>} modal nested>
        {(close) => (
          <>
            <button onClick={close}>&times;</button>
            <RecipeEditor
              recipeTitle={recipeTitle}
              description={description}
              ingredients={ingredients}
              directions={directions}
              setTitle={setTitle}
              setDescription={setDescription}
              setIngredients={setIngredients}
              setDirections={setDirections}
            />
          </>
        )}
      </Popup>
    </div>
  );
};

export default Recipe;
