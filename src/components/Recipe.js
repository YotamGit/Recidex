import { useState, useEffect } from "react";
import RecipeEditor from "./RecipeEditor";
import Popup from "reactjs-popup";
import "../styles/Recipe.css";
import { marked } from "marked";

const Recipe = () => {
  const [recipeTitle, setTitle] = useState("Corn Dogs");
  const [description, setDescription] = useState(
    "I made up this recipe many years ago, because I loved the corn dogs you buy at carnivals but could not find a recipe for them. Great served with mustard. "
  );
  const [ingredients, setIngredients] = useState(
    "* 1 cup yellow cornmeal\n* 1 cup all-purpose flour\n* <sup>1</sup>/<sub>4</sub> teaspoon salt\n* <sup>1</sup>/<sub>8</sub> teaspoon black pepper\n* <sup>1</sup>/<sub>4</sub> cup white sugar\n* 4 teaspoons baking soda\n* 1 egg\n* 1 cup milk\n* 1 quart vegetable oil for frying\n* 2 (16 ounce) packages beef frankfurters\n* 16 wooden skewers"
  );
  const [directions, setDirections] = useState(
    "### Step 1\nIn a medium bowl, combine cornmeal, flour, salt, pepper, sugar and baking powder. Stir in eggs and milk.\n### Step 2\nPreheat oil in a deep saucepan over medium heat. Insert wooden skewers into frankfurters. Roll frankfurters in batter until well coated.\n### Step 3\nFry 2 or 3 corn dogs at a time until lightly browned, about 3 minutes. Drain on paper towels."
  );

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
      <div className="recipe-section">
        <div className="recipe-title">Description</div>
        <div className="recipe-text-box" id="recipe-description"></div>
      </div>
      <div className="recipe-section">
        <div className="recipe-title">Ingredients</div>
        <div className="recipe-text-box" id="recipe-ingredients"></div>
      </div>
      <div className="recipe-section">
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
