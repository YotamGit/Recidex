import Recipe from "./Recipe.js";
const Recipes = ({ recipes, onEditRecipe }) => {
  return (
    <>
      {recipes.map((recipe) => (
        <Recipe key={recipe.id} recipe={recipe} onEditRecipe={onEditRecipe} />
      ))}
    </>
  );
};

export default Recipes;
