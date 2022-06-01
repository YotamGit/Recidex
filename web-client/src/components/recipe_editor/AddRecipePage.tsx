import RecipeEditor from "./RecipeEditor";
import PageTitle from "../PageTitle";

//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";

const AddRecipe: FC = () => {
  const recipeTemplate: TRecipe = {
    _id: "",
    approval_required: false,
    private: false,
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
    <>
      <div className="add-recipe-page-top-button-row"></div>
      <PageTitle style={{ marginTop: "1rem" }} />
      <RecipeEditor action={"add"} recipe={recipeTemplate}></RecipeEditor>
    </>
  );
};

export default AddRecipe;
