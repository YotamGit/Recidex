import "../../styles/recipes/RecipesPrivacySelector.css";
import RecipeDropdown from "../utilities/RecipeDropdown";

//mui
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

//redux
import { useAppSelector } from "../../hooks";

//types
import { FC } from "react";

interface propTypes {
  recipePrivacy: string;
  setRecipePrivacy: Function;
}
const RecipesPrivacySelector: FC<propTypes> = ({
  setRecipePrivacy,
  recipePrivacy,
}) => {
  const fullscreen = useAppSelector((state) => state.utilities.fullscreen);
  const recipePrivacyValues = useAppSelector(
    (state) => state.filters.recipe_privacy_values
  );
  return (
    <>
      {recipePrivacyValues && (
        <>
          {fullscreen ? (
            <ToggleButtonGroup
              className="privacy-filter-container"
              size="small"
              value={recipePrivacy}
              exclusive
              onChange={(e, value: string) =>
                value !== null && setRecipePrivacy(value)
              }
              aria-label="table mode"
            >
              {recipePrivacyValues?.map((value) => (
                <ToggleButton
                  key={value}
                  className="privacy-filter-button"
                  value={value}
                  aria-label={`${value} recipes`}
                >
                  {value}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          ) : (
            <div className="privacy-filter-container">
              <RecipeDropdown
                value={recipePrivacy}
                items={recipePrivacyValues}
                label_text={"privacy"}
                id_prefix={"main-recipe-privacy-selector"}
                class_name={"privacy-filter-dropdown"}
                onChange={setRecipePrivacy}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default RecipesPrivacySelector;
