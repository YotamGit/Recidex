import Recipe from "./Recipe";
import "../../styles/recipes/RecipePage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Share from "../buttons/Share";
import RecipeActionsMenuButton from "./RecipeActionsMenuButton";

//utils
import { getRecipe } from "../../utils-module/recipes";

//mui icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

//mui
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

//redux
import { useAppSelector } from "../../hooks";

//types
import { TRecipe } from "../../slices/recipesSlice";
import { FC } from "react";

const RecipePage: FC = () => {
  const navigate = useNavigate();
  const { recipe_id } = useParams();
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

  //update recipe when the store recipe updates
  useEffect(() => {
    if (storeRecipe !== undefined) {
      setRecipe(storeRecipe);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeRecipe]);

  //fetch recipe if the page refeshes/loads from url or the store recipe is missing
  useEffect(() => {
    if (recipe === undefined && recipe_id !== undefined) {
      getRecipe(recipe_id).then((res: TRecipe) => {
        if (res) {
          setRecipe(res);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {recipe && (
        <div className="recipe-page">
          <div className="recipe-page-top-button-row">
            <Tooltip title="Go back" arrow>
              <IconButton onClick={() => navigate(-1)}>
                <KeyboardBackspaceIcon className="icon" />
              </IconButton>
            </Tooltip>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <IconButton onClick={() => window.print()}>
                <LocalPrintshopIcon className="icon" />
              </IconButton>

              <Share url={window.location.href} emailTitle={recipe.title} />
            </div>
            <RecipeActionsMenuButton recipe={recipe} />
          </div>
          {recipe && <Recipe recipe={recipe} />}
        </div>
      )}
    </>
  );
};

export default RecipePage;
