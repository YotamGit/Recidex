import Recipes from "./recipes/Recipes";

const Main = ({ recipes, searchFilters, getRecipes }) => {
  return (
    <div>
      {recipes.length > 0 ? (
        <Recipes
          recipes={recipes}
          searchFilters={searchFilters}
          getRecipes={getRecipes}
        />
      ) : (
        "No Recipes To Show"
      )}
    </div>
  );
};

export default Main;
