import RecipeEditor from "./RecipeEditor.js";
import { useParams, useNavigate } from "react-router-dom";

import "../../styles/recipe_editor/RecipeEditorPage.css";
import AuthorizedButton from "../AuthorizedButton";

//mui icons
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

//redux
import { useSelector, useDispatch } from "react-redux";
import { deleteRecipe } from "../../slices/recipesSlice.js";
const RecipeEditorPage = ({
  recipe_categories,
  recipe_difficulties,
  recipe_durations,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipe_id } = useParams();

  const recipe = useSelector(
    (state) =>
      state.recipes.recipes.filter((recipe) => recipe._id === recipe_id)[0]
  );

  const onDeleteRecipe = async () => {
    var remove = window.confirm("Delete Recipe: " + recipe.title + "?");
    if (remove) {
      let deleteRes = await dispatch(deleteRecipe(recipe._id));
      if (!deleteRes.error) {
        navigate("/home");
      } else if (deleteRes.payload.statusCode === 401) {
        navigate("/login");
      }
    }
  };
  return (
    <div className="recipe-editor-page">
      {recipe && (
        <>
          <div className="recipe-editor-page-top-button-row">
            <AuthorizedButton onClick={() => navigate(-1)} authorized={true}>
              <CloseFullscreenRoundedIcon
                style={{
                  color: "gray",
                  margin: "1%",
                  fontSize: "3.5vh",
                  cursor: "pointer",
                }}
              />
            </AuthorizedButton>
            <AuthorizedButton onClick={() => onDeleteRecipe()}>
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
            action={"edit"}
            recipe={recipe}
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
