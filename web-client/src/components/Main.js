import Recipes from "./recipes/Recipes";

const Main = ({ recipes, getRecipes, onEditRecipe, deleteRecipe }) => {
  return (
    <div>
      {recipes.length > 0 ? (
        <Recipes
          recipes={recipes}
          getRecipes={getRecipes}
          onEditRecipe={onEditRecipe}
          deleteRecipe={deleteRecipe}
        />
      ) : (
        "No Recipes To Show"
      )}
    </div>
  );
};

export default Main;
