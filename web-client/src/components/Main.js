import "../styles/Main.css";
import Recipes from "./recipes/Recipes";
import { useEffect, useState } from "react";

//redux
import { useDispatch, useSelector } from "react-redux";
import { getRecipes } from "../slices/recipesSlice";
import {
  setOwner,
  setfavoritesOnly,
  setSearchText,
  resetFilters,
  setFiltered,
} from "../slices/filtersSlice";

//mui
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const Main = ({ ownerOnly, favoritesOnly }) => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false);

  const recipes = useSelector((state) => state.recipes.recipes);
  const fetchedAllRecipes = useSelector(
    (state) => state.recipes.fetchedAllRecipes
  );

  const owner = useSelector((state) => state.users.userId);
  const attemptSignIn = useSelector((state) => state.users.attemptSignIn);
  const routeHistory = useSelector((state) => state.utilities.routeHistory);

  const loadRecipes = async () => {
    if (recipes.length > 0) {
      setFetching(true);
      await dispatch(
        getRecipes({
          replace: false,
          args: {
            latest: recipes.at(-1).creation_time,
          },
        })
      );
      setFetching(false);
    }
  };

  const initialRecipesLoad = async () => {
    try {
      if (favoritesOnly) {
        //request for the favorites page
        dispatch(setOwner(undefined));
        await dispatch(
          getRecipes({
            replace: true,
            args: {},
          })
        );
      } else {
        //request for home/myrecipes pages depends on the ownerOnly flag
        dispatch(setOwner(ownerOnly && owner ? owner : undefined));
        await dispatch(
          getRecipes({
            replace: true,
            args: {},
          })
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    dispatch(setSearchText(undefined));
    dispatch(resetFilters());
    dispatch(setFiltered(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (attemptSignIn) {
      return;
    }

    if (
      ["/home", "/my-recipes", "/favorites"].includes(
        routeHistory.slice(-1)[0]
      ) ||
      (recipes.length === 0 && !fetchedAllRecipes)
    ) {
      dispatch(setfavoritesOnly(favoritesOnly));
      initialRecipesLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, ownerOnly, favoritesOnly, attemptSignIn]);

  useEffect(() => {
    const handleScroll = async () => {
      if (fetching) {
        return;
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, fetchedAllRecipes, fetching]);

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
      {!fetchedAllRecipes ? (
        <div>
          {fetching ? (
            <CircularProgress />
          ) : (
            <Button variant="contained" component="div" onClick={loadRecipes}>
              Load More Recipes
            </Button>
          )}
        </div>
      ) : (
        //switch to alert
        <Alert severity="info">No more recipes to show</Alert>
      )}
    </div>
  );
};

export default Main;
