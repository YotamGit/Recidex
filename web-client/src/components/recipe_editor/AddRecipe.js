import RecipeEditor from "./RecipeEditor";

const AddRecipe = ({ onAddRecipe }) => {
  const recipeTemplate = {
    _id: "",
    title: "",
    category: "",
    sub_category: "",
    difficulty: "",
    prep_time: "",
    total_time: "",
    servings: "",
    description: "",
    ingredients: "",
    directions: "",
    rtl: false,
    source: "",
    imageName: "",
    image: "",
  };

  return (
    <RecipeEditor
      onEditRecipe={onAddRecipe}
      recipe={recipeTemplate}
    ></RecipeEditor>
  );
};

export default AddRecipe;
