import { useState, useEffect } from "react";
import RecipeEditor from "./RecipeEditor";
import Popup from "reactjs-popup";
import "../styles/Recipe.css";
import { marked } from "marked";

const Recipe = () => {
  const [description, setDescription] = useState(
    "# Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );
  const [ingredients, setIngredients] = useState(
    "* Lorem ipsum dolor sit amet, consectetur adipiscing elit, \n\n* sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );
  const [directions, setDirections] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
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
              description={description}
              ingredients={ingredients}
              directions={directions}
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
