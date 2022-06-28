import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";

interface propTypes {
  kind: "approve" | "disapprove";
  type: "button" | "listItem";
  recipe: TRecipe;
  setDisabled: React.SetStateAction<boolean>;
}
const RecipeActionsMenuModerationButton: FC = () => {
  return <div>RecipeActionsMenuModerationButtons</div>;
};

export default RecipeActionsMenuModerationButton;
