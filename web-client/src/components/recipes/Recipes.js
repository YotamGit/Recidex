import { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard.js";
import "../../styles/recipes/Recipes.css";
const Recipes = ({ recipes, getRecipes, onEditRecipe, deleteRecipe }) => {
  const [reached_end, setReachedEnd] = useState(
    Object.keys(recipes).length === 0
  );
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        setFetching(true);
        var res = await getRecipes({
          latest: recipes.at(-1).creation_time,
          count: 4,
        });
        setFetching(false);
        setReachedEnd(res === 0);

        if (reached_end) {
          window.alert("No More Recipes to Show");
        }
      }

      return;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [recipes, reached_end, getRecipes]);

  return (
    <div className="recipes-container">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
          onEditRecipe={onEditRecipe}
          deleteRecipe={deleteRecipe}
        />
      ))}
    </div>
  );
};

export default Recipes;
