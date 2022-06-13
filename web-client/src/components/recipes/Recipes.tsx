import RecipeCard from "./RecipeCard";
import ModerationRecipeCard from "../recipe_moderation/ModerationRecipeCard";
import "../../styles/recipes/Recipes.css";
import { memo } from "react";

//redux
import { useAppSelector } from "../../hooks";

//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";

interface propTypes {
  approvalRequiredOnly: boolean;
  recipes: TRecipe[];
  chipsFilterFunction?: Function;
}

const Recipes: FC<propTypes> = ({
  recipes,
  approvalRequiredOnly,
  chipsFilterFunction,
}) => {
  return (
    <div className="recipes-container">
      {recipes.map((recipe) =>
        approvalRequiredOnly ? (
          <ModerationRecipeCard key={recipe._id} recipe={recipe} />
        ) : (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            chipsFilterFunction={chipsFilterFunction}
          />
        )
      )}
    </div>
  );
};

export default memo(Recipes);
