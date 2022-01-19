import RecipeCard from "./RecipeCard.js";
import "../../styles/recipes/Recipes.css";
const Recipes = ({ recipes, searchFilters, getRecipes }) => {
  return (
    <div className="recipes-container">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
};

export default Recipes;
