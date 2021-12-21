import Recipe from "./Recipe.js";
import "../styles/RecipePage.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const RecipePage = ({ recipes, onEditRecipe, deleteRecipe }) => {
  const { recipe_id } = useParams();
  const recipe = recipes.filter((recipe) => recipe.id === recipe_id)[0];
  return (
    <div className="recipe-page">
      {recipe && (
        <Recipe
          recipe={recipe}
          onEditRecipe={onEditRecipe}
          deleteRecipe={deleteRecipe}
        />
      )}
    </div>
  );
};

export default RecipePage;
