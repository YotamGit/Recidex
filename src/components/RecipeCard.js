import "../styles/RecipeCard.css";
import { Link } from "react-router-dom";
import Recipe from "./Recipe";

const RecipeCard = ({ recipe, onEditRecipe, deleteRecipe }) => {
  return (
    <div className="recipe-card">
      <Link className="recipe-btn" to={`/recipes/${recipe.id}`}>
        expand
      </Link>
      <Recipe
        recipe={recipe}
        onEditRecipe={onEditRecipe}
        deleteRecipe={deleteRecipe}
      />
    </div>
  );
};

export default RecipeCard;
