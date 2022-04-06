import React from "react";
import { useState, useEffect } from "react";
import RecipeDropdown from "./RecipeDropdown";
import "../styles/FilterDialog.css";
//mui
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
//mui icons
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DoDisturbOnRoundedIcon from "@mui/icons-material/DoDisturbOnRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getRecipes } from "../slices/recipesSlice";
import { setFiltered, setFilters } from "../slices/filtersSlice";

const FilterDialog = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [showRecipeFilterDialog, setShowRecipeFilterDialog] = useState(false);
  const searchText = useSelector((state) => state.filters.searchText);

  const recipe_categories = useSelector(
    (state) => state.filters.recipe_categories
  );
  const recipe_difficulties = useSelector(
    (state) => state.filters.recipe_difficulties
  );
  const recipe_durations = useSelector(
    (state) => state.filters.recipe_durations
  );

  const filtered = useSelector((state) => state.filters.filtered);

  const owner = useSelector((state) => state.filters.selectedFilters.owner);

  const [category, setCategory] = useState(
    useSelector((state) => state.filters.selectedFilters.category)
  );
  const [sub_category, setSubCategory] = useState(
    useSelector((state) => state.filters.selectedFilters.sub_category)
  );
  const [difficulty, setDifficulty] = useState(
    useSelector((state) => state.filters.selectedFilters.difficulty)
  );
  const [prep_time, setPrepTime] = useState(
    useSelector((state) => state.filters.selectedFilters.prep_time)
  );
  const [total_time, setTotalTime] = useState(
    useSelector((state) => state.filters.selectedFilters.total_time)
  );

  const RecipeFilterDialogToggle = () => {
    setShowRecipeFilterDialog(!showRecipeFilterDialog);
  };

  const handleFilterRecipes = async () => {
    var filters = {
      category,
      sub_category,
      difficulty,
      prep_time,
      total_time,
      owner,
    };
    dispatch(setFilters(filters));
    var filterRes = await dispatch(getRecipes({ replace: true, args: {} }));
    if (!filterRes.error) {
      dispatch(
        setFiltered(
          Object.values(filters).some((filter) => typeof filter !== "undefined")
        )
      );

      RecipeFilterDialogToggle();
    }
  };

  const clearSelections = () => {
    setCategory();
    setSubCategory();
    setDifficulty();
    setPrepTime();
    setTotalTime();
  };

  useEffect(() => {
    clearSelections();
  }, []);

  return (
    <>
      <IconButton onClick={RecipeFilterDialogToggle}>
        <FilterAltRoundedIcon
          className="header-dialog-button"
          style={{ color: filtered ? "green" : "#fff" }}
        />
      </IconButton>
      <Dialog
        fullScreen={fullScreen}
        open={showRecipeFilterDialog}
        onClose={RecipeFilterDialogToggle}
        aria-labelledby="recipe-filter-dialog-title"
      >
        <DialogTitle id="recipe-filter-dialog-title">
          {"Filter Recipes"}
        </DialogTitle>
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
                recipe_categories[category] ? recipe_categories[category] : []
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
        <DialogActions className="header-dialog-action-section">
          <CancelRoundedIcon
            className="header-dialog-button"
            autoFocus
            onClick={RecipeFilterDialogToggle}
            style={{ color: "rgb(255,0,0)" }}
          />
          <DoDisturbOnRoundedIcon
            className="header-dialog-button"
            onClick={clearSelections}
            style={{ color: "rgb(218,165,32)" }}
          />

          <CheckCircleRoundedIcon
            className="header-dialog-button"
            onClick={handleFilterRecipes}
            style={{ color: "rgb(34,139,34)" }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FilterDialog;
