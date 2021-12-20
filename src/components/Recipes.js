import RecipeCard from "./RecipeCard.js";
import "../styles/Recipes.css";
const Recipes = ({ recipes, onEditRecipe, deleteRecipe }) => {
  return (
    <div className="recipes-container">
      {recipes.map((recipe) => (
        <RecipeCard
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
