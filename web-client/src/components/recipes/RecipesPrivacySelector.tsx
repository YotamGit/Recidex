import "../../styles/recipes/RecipesPrivacySelector.css";
import RecipeDropdown from "../RecipeDropdown";

//mui
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

//redux
import { useAppSelector } from "../../hooks";

//types
import { FC } from "react";
import { recipePrivacyState } from "../../slices/filtersSlice";

interface propTypes {
  recipePrivacy: recipePrivacyState;
  setRecipePrivacy: Function;
}
const RecipesPrivacySelector: FC<propTypes> = ({
  setRecipePrivacy,
  recipePrivacy,
}) => {
  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);

  return (
    <>
      {fullscreen ? (
        <ToggleButtonGroup
          className="privacy-filter-container"
          size="small"
          value={recipePrivacy}
          exclusive
          onChange={(e, value: recipePrivacyState) =>
            value !== null && setRecipePrivacy(value)
          }
          aria-label="table mode"
        >
          <ToggleButton
            className="privacy-filter-button"
            value={"all"}
            aria-label="all recipes"
          >
            All
          </ToggleButton>
          <ToggleButton
            className="privacy-filter-button"
            value={"public"}
            aria-label="public recipes"
          >
            Public
          </ToggleButton>
          <ToggleButton
            className="privacy-filter-button"
            value={"pending approval"}
            aria-label="pending approval recipes"
          >
            Pending Approval
          </ToggleButton>
          <ToggleButton
            className="privacy-filter-button"
            value={"approved"}
            aria-label="approved recipes"
          >
            Approved
          </ToggleButton>
          <ToggleButton
            className="privacy-filter-button"
            value={"private"}
            aria-label="private recipes"
          >
            Private
          </ToggleButton>
        </ToggleButtonGroup>
      ) : (
        <div className="privacy-filter-container">
          <RecipeDropdown
            value={recipePrivacy}
            items={["all", "public", "pending approval", "approved", "private"]}
            label_text={"privacy"}
            id_prefix={"main-recipe-privacy-selector"}
            class_name={"privacy-filter-dropdown"}
            onChange={setRecipePrivacy}
          />
        </div>
      )}
    </>
  );
};

export default RecipesPrivacySelector;
