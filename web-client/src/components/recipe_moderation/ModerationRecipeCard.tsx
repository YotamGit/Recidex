//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";

interface propTypes {}

interface propTypes {
  recipe: TRecipe;
}
const ModerationRecipeCard: FC<propTypes> = ({ recipe }) => {
  return <div>ModerationRecipeCard</div>;
};

export default ModerationRecipeCard;
