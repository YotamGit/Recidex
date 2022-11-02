import RecipeEditor from "./RecipeEditor";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, FC } from "react";
import { mainRecipesRoutes, moderatorRoles } from "../../App";

import { getRecipe } from "../../utils-module/recipes";
import GenericPromptDialog from "../utilities/GenericPromptDialog";
import PageTitle from "../utilities/PageTitle";

import "../../styles/recipe_editor/RecipeEditorPage.css";
import AuthorizedButton from "../login/AuthorizedButton";

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

  const signedIn = useAppSelector((state) => state.users.signedIn);
  const attemtSignIn = useAppSelector((state) => state.users.attemptSignIn);
  const userData = useAppSelector((state) => state.users.userData);

  const { recipe_id } = useParams();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const routeHistory = useAppSelector((state) => state.utilities.routeHistory);

  const [disableDeleteButton, setDisableDeleteButton] = useState(false);

  const [recipe, setRecipe] = useState(
    useAppSelector(
      (state) =>
        state.recipes.recipes.filter((recipe) => recipe._id === recipe_id)[0]
    )
  );

  const storeRecipe = useAppSelector(
    (state) =>
      state.recipes.recipes.filter((recipe) => recipe._id === recipe_id)[0]
  );

  useEffect(() => {
    if (recipe === undefined && recipe_id) {
      getRecipe(recipe_id).then((res) => {
        setRecipe(res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //update recipe when the store recipe updates
  useEffect(() => {
    if (storeRecipe !== undefined) {
      setRecipe(storeRecipe);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeRecipe]);

  //redirect to home if not owner/moderator
  useEffect(() => {
    if (!signedIn && !attemtSignIn) {
      navigate("/");
      return;
    }
    if (
      recipe !== undefined &&
      recipe.owner?._id !== userData._id &&
      !moderatorRoles.includes(userData.role || "")
    ) {
      navigate("/");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe, attemtSignIn, signedIn]);

  const onDeleteRecipe = async () => {
    setDisableDeleteButton(true);

    if (!recipe._id) return;

    let deleteRes = await dispatch(deleteRecipe({ id: recipe._id }));

    if (deleteRes.meta.requestStatus === "fulfilled") {
      let lastMainPageVisited = [...routeHistory]
        .slice(0, routeHistory.length - 1)
        .reverse()
        .find((element) =>
          mainRecipesRoutes.includes(element.pathname)
        )?.pathname;
      navigate(lastMainPageVisited || "/home");
    } else {
      setDisableDeleteButton(false);
    }
  };

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
              disabled={disableDeleteButton}
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
          <PageTitle />
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
