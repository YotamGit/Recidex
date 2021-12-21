import RecipeEditor from "./RecipeEditor";

const AddRecipe = ({ onAddRecipe }) => {
  const recipeTemplate = {
    title: "Title",
    description: "Description",
    ingredients: `Ingredients`,
    directions: `Direction`,
    rtl: false,
    source: "Source",
  };

  return (
    <RecipeEditor
      onEditRecipe={onAddRecipe}
      recipe={recipeTemplate}
    ></RecipeEditor>
  );
};

export default AddRecipe;
