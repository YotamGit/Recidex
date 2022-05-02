import RecipeCard from "./RecipeCard";
import "../../styles/recipes/Recipes.css";

//redux
import { useAppSelector } from "../../hooks";

//types
import { FC } from "react";

const Recipes: FC = () => {
  const recipes = useAppSelector((state) => state.recipes.recipes);
  return (
    <div className="recipes-container">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
};

export default Recipes;
