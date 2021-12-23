import RecipeEditor from "./RecipeEditor";

const AddRecipe = ({ onAddRecipe }) => {
  const recipeTemplate = {
    id: "",
    title: "",
    category: "",
    difficulty: "",
    timeframe: "",
    description: "",
    ingredients: "",
    directions: "",
    rtl: false,
    source: "",
  };

  return (
    <RecipeEditor
      onEditRecipe={onAddRecipe}
      recipe={recipeTemplate}
    ></RecipeEditor>
  );
};

export default AddRecipe;
