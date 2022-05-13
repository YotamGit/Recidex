import RecipeCard from "./RecipeCard";
import ModerationRecipeCard from "../recipe_moderation/ModerationRecipeCard";
import "../../styles/recipes/Recipes.css";

//redux
import { useAppSelector } from "../../hooks";

//types
import { FC } from "react";

interface propTypes {
  approvalRequiredOnly: boolean;
}
const Recipes: FC<propTypes> = ({ approvalRequiredOnly }) => {
  const recipes = useAppSelector((state) => state.recipes.recipes);
  return (
    <div className="recipes-container">
      {recipes.map((recipe) =>
        approvalRequiredOnly ? (
          <ModerationRecipeCard key={recipe._id} recipe={recipe} />
        ) : (
          <RecipeCard key={recipe._id} recipe={recipe} />
        )
      )}
    </div>
  );
};

export default Recipes;
