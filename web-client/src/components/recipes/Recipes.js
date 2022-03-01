import RecipeCard from "./RecipeCard.js";
import "../../styles/recipes/Recipes.css";

//redux
import { useSelector } from "react-redux";

const Recipes = () => {
  const recipes = useSelector((state) => state.recipes.recipes);
  return (
    <div className="recipes-container">
      <div>{recipes.length}</div>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
};

export default Recipes;
