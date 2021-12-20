import Recipe from "./RecipeEditor.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const RecipeEditorPage = ({ recipes, onEditRecipe }) => {
  const { recipe_id } = useParams();
  const recipe = recipes.filter((recipe) => recipe.id === recipe_id)[0];
  return (
    <div>
      <Link to="/home">Home Page</Link>
      {recipe && <Recipe recipe={recipe} onEditRecipe={onEditRecipe} />}
    </div>
  );
};

export default RecipeEditorPage;
