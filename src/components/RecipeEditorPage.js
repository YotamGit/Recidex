import RecipeEditor from "./RecipeEditor.js";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/RecipeEditorPage.css";
import IconButton from "@mui/material/IconButton";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";

const RecipeEditorPage = ({ recipes, onEditRecipe }) => {
  const navigate = useNavigate();
  const { recipe_id } = useParams();
  const recipe = recipes.filter((recipe) => recipe.id === recipe_id)[0];
  return (
    <div className="recipe-editor-page">
      <IconButton
        onClick={() => navigate(-1)}
        style={{ color: "gray", margin: "1%" }}
      >
        <CloseFullscreenRoundedIcon style={{ fontSize: "3.5vh" }} />
      </IconButton>
      {recipe && <RecipeEditor recipe={recipe} onEditRecipe={onEditRecipe} />}
    </div>
  );
};

export default RecipeEditorPage;
