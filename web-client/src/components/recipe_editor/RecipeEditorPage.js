import RecipeEditor from "./RecipeEditor.js";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { getRecipe } from "../../utils-module/recipes.ts";

import "../../styles/recipe_editor/RecipeEditorPage.css";
import AuthorizedButton from "../Login/AuthorizedButton";

//mui
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

//mui icons
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

//redux
import { useSelector, useDispatch } from "react-redux";
import { deleteRecipe } from "../../slices/recipesSlice.ts";
const RecipeEditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipe_id } = useParams();

  const [recipe, setRecipe] = useState(
    useSelector(
      (state) =>
        state.recipes.recipes.filter((recipe) => recipe._id === recipe_id)[0]
    )
  );

  const onDeleteRecipe = async () => {
    var remove = window.confirm("Delete Recipe: " + recipe.title + "?");
    if (remove) {
      let deleteRes = await dispatch(deleteRecipe(recipe._id));
      if (!deleteRes.error) {
        navigate("/home");
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (recipe === undefined) {
      getRecipe(recipe_id).then((res) => {
        setRecipe(res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="recipe-editor-page">
      {recipe && (
        <>
          <div className="recipe-editor-page-top-button-row">
            <Tooltip title="Close Editor" arrow>
              <IconButton onClick={() => navigate(-1)}>
                <CloseFullscreenRoundedIcon
                  className="icon"
                  style={{
                    color: "gray",
                  }}
                />
              </IconButton>
            </Tooltip>
            <AuthorizedButton type={"icon"} onClick={() => onDeleteRecipe()}>
              <Tooltip title="Delete recipe" arrow>
                <DeleteForeverRoundedIcon
                  className="icon"
                  style={{
                    color: "red",
                  }}
                />
              </Tooltip>
            </AuthorizedButton>
          </div>

          <RecipeEditor action={"edit"} recipe={recipe} />
        </>
      )}
    </div>
  );
};

export default RecipeEditorPage;
