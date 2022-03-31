import Recipes from "./recipes/Recipes";
import { useEffect, useState } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getRecipes } from "../slices/recipesSlice";

//mui
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const Main = () => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false);
  const selectedFilters = useSelector((state) => state.filters.selectedFilters);
  const recipes = useSelector((state) => state.recipes.recipes);
  const reached_end = useSelector((state) => state.recipes.fetchedAllRecipes);

  const loadRecipes = async () => {
    if (recipes.length > 0) {
      setFetching(true);
      await dispatch(
        getRecipes({
          latest: recipes.at(-1).creation_time,
          count: 4,
          filters: selectedFilters,
        })
      );
      setFetching(false);
    }
    if (reached_end) {
      window.alert("No More Recipes to Show");
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1
      ) {
        // window.alert(
        //   `${window.innerHeight} + ${document.documentElement.scrollTop} = ${document.documentElement.offsetHeight}`
        // );

        await loadRecipes();
      }

      return;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [recipes, reached_end, getRecipes]);

  return (
    <div
      className="main"
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {recipes.length > 0 ? (
        <Recipes />
      ) : (
        "No Recipes To Show" //show skeleton loading animation if fetching is true
      )}
      {!reached_end && (
        <div>
          {fetching ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" component="div" onClick={loadRecipes}>
              Load Recipes
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Main;
