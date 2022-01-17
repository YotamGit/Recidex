import RecipeEditor from "./RecipeEditor.js";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "../../styles/recipe_editor/RecipeEditorPage.css";
//mui
import IconButton from "@mui/material/IconButton";

//mui icons
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

const RecipeEditorPage = ({
  signedIn,
  getRecipe,
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
    try {
      var result = await deleteRecipe(recipe._id);

      if (result) {
        navigate("/home");
      }
    } catch (error) {
      window.alert(error);
    }
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
            {signedIn && (
              <DeleteForeverRoundedIcon
                style={{
                  color: "red",
                  margin: "1%",
                  fontSize: "3.5vh",
                  cursor: "pointer",
                }}
                onClick={() => onDeleteRecipe()}
              />
            )}
          </div>

          <RecipeEditor
            recipe={recipe}
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
