import RecipeCard from "./RecipeCard";
import ModerationRecipeCard from "../recipe_moderation/ModerationRecipeCard";
import "../../styles/recipes/Recipes.css";

//import
import RecipeCardSkeleton from "../skeletons/RecipeCardSkeleton";
//redux
import { useAppSelector } from "../../hooks";

//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";

interface propTypes {
  approvalRequiredOnly: boolean;
  recipes: TRecipe[];
  loading?: boolean;
  local?: {
    setRecipe?: (updatedRecipe: TRecipe) => void;
    chipsFilterFunction?: Function;
  };
}

const Recipes: FC<propTypes> = ({
  recipes,
  local,
  approvalRequiredOnly,
  loading,
}) => {
  return (
    <div className="recipes-container">
      {recipes.map((recipe) =>
        approvalRequiredOnly ? (
          <ModerationRecipeCard key={recipe._id} recipe={recipe} />
        ) : (
          <RecipeCard key={recipe._id} recipe={recipe} local={local} />
        )
      )}
      {loading &&
        Array.from({ length: 8 }, (v, k) => k + 1).map((_) => (
          <RecipeCardSkeleton
            key={_}
            kind={approvalRequiredOnly ? "moderation" : "regular"}
          />
        ))}
    </div>
  );
};

export default Recipes;
