import "../../styles/recipes/RecipeCardChips.css";
//redux
import { useAppDispatch } from "../../hooks";
import {
  setFilters,
  setFiltered,
  setPagination,
  defaultPagination,
} from "../../slices/filtersSlice";
import { getRecipes } from "../../slices/recipesSlice";

//mui
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";

//types
import { TRecipe } from "../../slices/recipesSlice";
import { FC } from "react";

interface propTypes {
  recipe: TRecipe;
  chipsFilterFunction?: Function;
}
const RecipeCardChips: FC<propTypes> = ({ recipe, chipsFilterFunction }) => {
  const dispatch = useAppDispatch();

  const chipCategoryOnClick = async () => {
    let filters = {
      category: recipe.category,
      sub_category: undefined,
      difficulty: undefined,
      prep_time: undefined,
      total_time: undefined,
    };

    if (chipsFilterFunction) {
      chipsFilterFunction(filters);
      return;
    }

    dispatch(setFilters(filters));
    dispatch(setPagination(defaultPagination));

    let filterRes = await dispatch(getRecipes({ replace: true }));

    if (filterRes.meta.requestStatus === "fulfilled") {
      dispatch(setFiltered(true));
    }
  };

  const chipSubCategoryOnClick = async () => {
    let filters = {
      category: recipe.category,
      sub_category: recipe.sub_category,
      difficulty: undefined,
      prep_time: undefined,
      total_time: undefined,
    };

    if (chipsFilterFunction) {
      chipsFilterFunction(filters);
      return;
    }

    dispatch(setFilters(filters));
    let filterRes = await dispatch(getRecipes({ replace: true }));
    if (filterRes.meta.requestStatus === "fulfilled") {
      dispatch(setFiltered(true));
    }
  };

  const chipDifficultyOnClick = async () => {
    let filters = {
      category: undefined,
      sub_category: undefined,
      difficulty: recipe.difficulty,
      prep_time: undefined,
      total_time: undefined,
    };

    if (chipsFilterFunction) {
      chipsFilterFunction(filters);
      return;
    }

    dispatch(setFilters(filters));
    let filterRes = await dispatch(getRecipes({ replace: true }));
    if (filterRes.meta.requestStatus === "fulfilled") {
      dispatch(setFiltered(true));
    }
  };

  return (
    <div className="recipe-data-chips">
      {recipe.category && (
        <Tooltip title="Filter category" arrow>
          <Chip
            className="recipe-data-chip"
            label={recipe.category}
            onClick={chipCategoryOnClick}
          />
        </Tooltip>
      )}
      {recipe.sub_category && (
        <Tooltip title="Filter sub category" arrow>
          <Chip
            className="recipe-data-chip"
            label={recipe.sub_category}
            onClick={chipSubCategoryOnClick}
          />
        </Tooltip>
      )}
      {recipe.difficulty && (
        <Tooltip title="Filter difficulty" arrow>
          <Chip
            className="recipe-data-chip"
            label={recipe.difficulty}
            onClick={chipDifficultyOnClick}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default RecipeCardChips;
