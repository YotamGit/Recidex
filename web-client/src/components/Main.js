import Recipes from "./recipes/Recipes";
import { useEffect, useState } from "react";

const Main = ({ recipes, searchFilters, getRecipes }) => {
  const [reached_end, setReachedEnd] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1
      ) {
        // window.alert(
        //   `${window.innerHeight} + ${document.documentElement.scrollTop} = ${document.documentElement.offsetHeight}`
        // );
        setFetching(true);
        var res = await getRecipes({
          latest: recipes.at(-1).creation_time,
          count: 4,
          filters: searchFilters,
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
    <div>
      {recipes.length > 0 ? (
        <Recipes
          recipes={recipes}
          searchFilters={searchFilters}
          getRecipes={getRecipes}
        />
      ) : (
        "No Recipes To Show" //show skeleton loading animation if fetching is true
      )}
    </div>
  );
};

export default Main;
