import RecipeEditor from "./RecipeEditor.js";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/RecipeEditorPage.css";

const RecipeEditorPage = ({ recipes, onEditRecipe }) => {
  const { recipe_id } = useParams();
  const recipe = recipes.filter((recipe) => recipe.id === recipe_id)[0];
  return (
    <div className="recipe-editor-page">
      {recipe && <RecipeEditor recipe={recipe} onEditRecipe={onEditRecipe} />}
    </div>
  );
};

export default RecipeEditorPage;
