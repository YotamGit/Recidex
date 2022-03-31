import Recipes from "./recipes/Recipes";
import { useEffect, useState } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import { filterRecipes, getRecipes } from "../slices/recipesSlice";
import { setOwner } from "../slices/filtersSlice";

//mui
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const Main = ({ ownerOnly }) => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false);
  const selectedFilters = useSelector((state) => state.filters.selectedFilters);
  const recipes = useSelector((state) => state.recipes.recipes);
  const fetchedAllRecipes = useSelector(
    (state) => state.recipes.fetchedAllRecipes
  );
  const owner = useSelector((state) => state.users.userId);

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
    if (fetchedAllRecipes) {
      window.alert("No More Recipes to Show");
    }
  };

  const initialRecipesLoad = async () => {
    try {
      dispatch(setOwner(ownerOnly && owner ? owner : undefined));

      await dispatch(
        filterRecipes({
          ...selectedFilters,
          owner: ownerOnly && owner ? owner : undefined,
        })
      );
    } catch (error) {}
  };
  useEffect(() => {
    initialRecipesLoad();
  }, [owner, ownerOnly]);

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
  }, [recipes, fetchedAllRecipes]);

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
      {!fetchedAllRecipes && (
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
