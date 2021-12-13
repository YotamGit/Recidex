import Recipe from "./Recipe.js";
import "../styles/Recipes.css";
const Recipes = ({ recipes, onEditRecipe }) => {
  return (
    <div className="recipes-container">
      {recipes.map((recipe) => (
        <Recipe key={recipe.id} recipe={recipe} onEditRecipe={onEditRecipe} />
      ))}
    </div>
  );
};

export default Recipes;
