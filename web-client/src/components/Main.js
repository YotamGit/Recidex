import Recipes from "./recipes/Recipes";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getRecipes } from "../slices/recipesSlice";

const Main = () => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false);
  const selectedFilters = useSelector((state) => state.filters.selectedFilters);
  const recipes = useSelector((state) => state.recipes.recipes);
  const reached_end = useSelector((state) => state.recipes.fetchedAllRecipes);

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
        await dispatch(
          getRecipes({
            latest: recipes.at(-1).creation_time,
            count: 4,
            filters: selectedFilters,
          })
        );
        setFetching(false);

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
        <Recipes />
      ) : (
        "No Recipes To Show" //show skeleton loading animation if fetching is true
      )}
    </div>
  );
};

export default Main;
