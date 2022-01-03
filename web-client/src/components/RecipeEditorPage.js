import RecipeEditor from "./RecipeEditor.js";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/RecipeEditorPage.css";
//mui
import IconButton from "@mui/material/IconButton";

//icons
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

const RecipeEditorPage = ({ recipes, onEditRecipe, deleteRecipe }) => {
  const navigate = useNavigate();
  const { recipe_id } = useParams();
  const recipe = recipes.filter((recipe) => recipe._id === recipe_id)[0];

  const onDeleteRecipe = async () => {
    await deleteRecipe(recipe._id)
      .then((result) => {
        if (result) {
          navigate("/home");
        }
      })
      .catch((error) => {
        window.alert(error);
        return;
      });
  };
  return (
    <div className="recipe-editor-page">
      {recipe && (
        <>
          <div className="recipe-editor-page-top-button-row">
            <IconButton
              onClick={() => navigate(-1)}
              style={{ color: "gray", margin: "1%" }}
            >
              <CloseFullscreenRoundedIcon style={{ fontSize: "3.5vh" }} />
            </IconButton>
            <DeleteForeverRoundedIcon
              style={{
                color: "red",
                margin: "1%",
                fontSize: "3.5vh",
                cursor: "pointer",
              }}
              onClick={() => onDeleteRecipe()}
            />
          </div>
          <RecipeEditor recipe={recipe} onEditRecipe={onEditRecipe} />
        </>
      )}
    </div>
  );
};

export default RecipeEditorPage;
