import RecipeEditor from "./RecipeEditor.js";
import { useParams, useNavigate } from "react-router-dom";

import "../../styles/recipe_editor/RecipeEditorPage.css";
import AuthorizedButton from "../AuthorizedButton";

//mui icons
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

const RecipeEditorPage = ({
  signedIn,
  setSignedIn,
  recipes,
  onEditRecipe,
  deleteRecipe,
  recipe_categories,
  recipe_difficulties,
  recipe_durations,
}) => {
  const navigate = useNavigate();
  const { recipe_id } = useParams();
  const recipe = recipes.filter((recipe) => recipe._id === recipe_id)[0];

  const onDeleteRecipe = async () => {
    var remove = window.confirm("Delete Recipe: " + recipe.title + "?");
    if (remove) {
      var result = await deleteRecipe(recipe._id);
      if (result) {
        navigate("/home");
      }
    }
  };
  return (
    <div className="recipe-editor-page">
      {recipe && (
        <>
          <div className="recipe-editor-page-top-button-row">
            <AuthorizedButton
              onClick={() => navigate(-1)}
              authorized={true}
              setSignedIn={setSignedIn}
            >
              <CloseFullscreenRoundedIcon
                style={{
                  color: "gray",
                  margin: "1%",
                  fontSize: "3.5vh",
                  cursor: "pointer",
                }}
              />
            </AuthorizedButton>
            <AuthorizedButton
              onClick={() => onDeleteRecipe()}
              authorized={signedIn}
              setSignedIn={setSignedIn}
            >
              <DeleteForeverRoundedIcon
                style={{
                  color: "red",
                  margin: "1%",
                  fontSize: "3.5vh",
                  cursor: "pointer",
                }}
              />
            </AuthorizedButton>
          </div>

          <RecipeEditor
            recipe={recipe}
            signedIn={signedIn}
            setSignedIn={setSignedIn}
            onEditRecipe={onEditRecipe}
            recipe_categories={recipe_categories}
            recipe_difficulties={recipe_difficulties}
            recipe_durations={recipe_durations}
          />
        </>
      )}
    </div>
  );
};

export default RecipeEditorPage;