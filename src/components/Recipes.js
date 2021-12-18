import Recipe from "./Recipe.js";
import "../styles/Recipes.css";
const Recipes = ({ recipes, onEditRecipe, deleteRecipe }) => {
  return (
    <div className="recipes-container">
      {recipes.map((recipe) => (
        <Recipe
          key={recipe.id}
          recipe={recipe}
          onEditRecipe={onEditRecipe}
          deleteRecipe={deleteRecipe}
        />
      ))}
    </div>
  );
};

export default Recipes;
