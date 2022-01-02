import Recipes from "./Recipes";

const Main = ({ recipes, getRecipes, onEditRecipe, deleteRecipe }) => {
  return (
    <div>
      {recipes.length > 0 ? (
        <Recipes
          recipes={recipes}
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
