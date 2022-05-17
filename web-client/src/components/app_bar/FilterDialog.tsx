import { useState, useEffect } from "react";
import RecipeDropdown from "../RecipeDropdown";
import "../../styles/app_bar/FilterDialog.css";
//mui
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

//mui icons
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DoDisturbOnRoundedIcon from "@mui/icons-material/DoDisturbOnRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

//redux
import { useAppSelector, useAppDispatch } from "../../hooks";
import { getRecipes } from "../../slices/recipesSlice";
import { setFiltered, setFilters } from "../../slices/filtersSlice";

const FilterDialog = () => {
  const dispatch = useAppDispatch();

  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);
  const [showRecipeFilterDialog, setShowRecipeFilterDialog] = useState(false);

  const recipe_categories = useAppSelector(
    (state) => state.filters.recipe_categories
  );
  const recipe_difficulties = useAppSelector(
    (state) => state.filters.recipe_difficulties
  );
  const recipe_durations = useAppSelector(
    (state) => state.filters.recipe_durations
  );

  const filtered = useAppSelector((state) => state.filters.filtered);

  const selectedFilters = useAppSelector(
    (state) => state.filters.selectedFilters
  );
  const [category, setCategory] = useState(selectedFilters.category);
  const [sub_category, setSubCategory] = useState(selectedFilters.sub_category);
  const [difficulty, setDifficulty] = useState(selectedFilters.difficulty);
  const [prep_time, setPrepTime] = useState(selectedFilters.prep_time);
  const [total_time, setTotalTime] = useState(selectedFilters.total_time);

  const recipeFilterDialogToggle = () => {
    setShowRecipeFilterDialog(!showRecipeFilterDialog);
  };

  const handleFilterRecipes = async () => {
    let filters = {
      category,
      sub_category,
      difficulty,
      prep_time,
      total_time,
    };
    dispatch(setFilters(filters));
    let filterRes = await dispatch(getRecipes({ replace: true }));

    if (filterRes.meta.requestStatus === "fulfilled") {
      dispatch(
        setFiltered(
          Object.values(filters).some((filter) => typeof filter !== "undefined")
        )
      );
    }
    recipeFilterDialogToggle();
  };

  const clearSelections = () => {
    setCategory(undefined);
    setSubCategory(undefined);
    setDifficulty(undefined);
    setPrepTime(undefined);
    setTotalTime(undefined);
  };

  useEffect(() => {
    clearSelections();
  }, []);

  useEffect(() => {
    setCategory(selectedFilters.category);
    setSubCategory(selectedFilters.sub_category);
    setDifficulty(selectedFilters.difficulty);
    setPrepTime(selectedFilters.prep_time);
    setTotalTime(selectedFilters.total_time);
  }, [selectedFilters]);

  return (
    <>
      <IconButton onClick={recipeFilterDialogToggle}>
        <FilterAltRoundedIcon
          className="icon"
          style={{ color: filtered ? "rgb(125, 221, 112)" : "" }}
        />
      </IconButton>
      <Dialog
        className="recipe-filter-dialog"
        fullScreen={!fullscreen}
        open={showRecipeFilterDialog}
        onClose={recipeFilterDialogToggle}
      >
        <DialogTitle className="title">{"Filter Recipes"}</DialogTitle>
        <DialogContent>
          <div className="recipe-filter-selectors-input-container">
            <RecipeDropdown
              value={category}
              items={Object.keys(recipe_categories)}
              label_text={"Category"}
              id_prefix={"filter-category"}
              class_name={"recipe-filter-form-control"}
              onChange={setCategory}
            />
            <RecipeDropdown
              value={sub_category}
              items={
                recipe_categories[category || ""]
                  ? recipe_categories[category || ""]
                  : []
              }
              label_text={"Sub Category"}
              id_prefix={"filter-sub_category"}
              class_name={"recipe-filter-form-control"}
              onChange={setSubCategory}
            />
            <RecipeDropdown
              value={difficulty}
              items={recipe_difficulties}
              label_text={"Difficulty"}
              id_prefix={"filter-difficulty"}
              class_name={"recipe-filter-form-control"}
              onChange={setDifficulty}
            />
            <RecipeDropdown
              value={prep_time}
              items={recipe_durations}
              label_text={"Prep Time"}
              id_prefix={"filter-prep-time"}
              class_name={"recipe-filter-form-control"}
              onChange={setPrepTime}
            />
            <RecipeDropdown
              value={total_time}
              items={recipe_durations}
              label_text={"Total Time"}
              id_prefix={"filter-total-time"}
              class_name={"recipe-filter-form-control"}
              onChange={setTotalTime}
            />
          </div>
        </DialogContent>
        <DialogActions className="filter-dialog-action-section">
          <Tooltip title="Cancel" arrow>
            <CancelRoundedIcon
              className="icon"
              onClick={recipeFilterDialogToggle}
              style={{ color: "rgb(255, 93, 85)" }}
            />
          </Tooltip>
          <Tooltip title="Clear Filters" arrow>
            <DoDisturbOnRoundedIcon
              className="icon"
              onClick={clearSelections}
              style={{ color: "rgb(242, 147, 57)" }}
            />
          </Tooltip>

          <Tooltip title="Apply Filters" arrow>
            <CheckCircleRoundedIcon
              className="icon"
              onClick={handleFilterRecipes}
              style={{ color: "rgb(125, 221, 112)" }}
            />
          </Tooltip>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FilterDialog;
