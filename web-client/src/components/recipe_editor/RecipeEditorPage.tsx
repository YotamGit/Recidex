import RecipeEditor from "./RecipeEditor";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, FC } from "react";

import { getRecipe } from "../../utils-module/recipes";
import GenericPromptDialog from "../GenericPromptDialog";

import "../../styles/recipe_editor/RecipeEditorPage.css";
import AuthorizedButton from "../Login/AuthorizedButton";

//mui
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

//mui icons
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

//redux
import { useAppSelector, useAppDispatch } from "../../hooks";
import { deleteRecipe } from "../../slices/recipesSlice";

const RecipeEditorPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { recipe_id } = useParams();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [recipe, setRecipe] = useState(
    useAppSelector(
      (state) =>
        state.recipes.recipes.filter((recipe) => recipe._id === recipe_id)[0]
    )
  );

  const onDeleteRecipe = async () => {
    if (!recipe._id) return;

    let deleteRes = await dispatch(deleteRecipe({ id: recipe._id }));

    if (deleteRes.meta.requestStatus === "fulfilled") {
      navigate("/home");
    }
  };

  useEffect(() => {
    if (recipe === undefined && recipe_id) {
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
                <CloseFullscreenRoundedIcon className="icon" />
              </IconButton>
            </Tooltip>
            <AuthorizedButton
              type={"icon"}
              onClick={() => setOpenConfirmDialog(true)}
            >
              <Tooltip title="Delete recipe" arrow>
                <DeleteForeverRoundedIcon
                  className="icon"
                  style={{
                    color: "rgb(255, 93, 85)",
                  }}
                />
              </Tooltip>
            </AuthorizedButton>
          </div>

          <RecipeEditor action={"edit"} recipe={recipe} />
          <GenericPromptDialog
            open={openConfirmDialog}
            setOpen={setOpenConfirmDialog}
            onConfirm={onDeleteRecipe}
            title="Delete Recipe?"
            text={`Delete recipe - "${recipe.title}"?`}
          />
        </>
      )}
    </div>
  );
};

export default RecipeEditorPage;
