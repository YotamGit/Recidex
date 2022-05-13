import "../styles/Main.css";
import Recipes from "./recipes/Recipes";
import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//redux
import { useAppDispatch, useAppSelector } from "../hooks";
import { getRecipes } from "../slices/recipesSlice";
import {
  setOwnerOnly,
  setfavoritesOnly,
  setApprovalRequiredOnly,
} from "../slices/filtersSlice";

//mui
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

interface propTypes {
  ownerOnly: boolean;
  favoritesOnly: boolean;
  approvalRequiredOnly: boolean;
}

const Main: FC<propTypes> = ({
  ownerOnly,
  favoritesOnly,
  approvalRequiredOnly,
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [fetching, setFetching] = useState(false);

  const recipes = useAppSelector((state) => state.recipes.recipes);
  const fetchedAllRecipes = useAppSelector(
    (state) => state.recipes.fetchedAllRecipes
  );

  const attemptSignIn = useAppSelector((state) => state.users.attemptSignIn);
  const routeHistory = useAppSelector((state) => state.utilities.routeHistory);

  const loadRecipes = async () => {
    if (recipes.length > 0) {
      setFetching(true);
      await dispatch(
        getRecipes({
          replace: false,
          args: {
            latest: recipes.at(-1)?.creation_time,
          },
        })
      );
      setFetching(false);
    }
  };

  const initialRecipesLoad = async () => {
    try {
      await dispatch(
        getRecipes({
          replace: true,
        })
      );
    } catch (error) {}
  };

  useEffect(() => {
    if (attemptSignIn) {
      return;
    }

    let lastMainPageVisited = [...routeHistory]
      .slice(0, routeHistory.length - 1)
      .reverse()
      .find((element) =>
        ["/home", "/my-recipes", "/favorites", "/recipe-moderation"].includes(
          element
        )
      );

    if (
      ["/home", "/my-recipes", "/favorites", "/recipe-moderation"].includes(
        routeHistory.slice(-1)[0]
      ) ||
      location.pathname !== lastMainPageVisited ||
      (recipes.length === 0 && !fetchedAllRecipes)
    ) {
      dispatch(setfavoritesOnly(favoritesOnly));
      dispatch(setOwnerOnly(ownerOnly));
      dispatch(setApprovalRequiredOnly(approvalRequiredOnly));
      initialRecipesLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerOnly, favoritesOnly, approvalRequiredOnly, attemptSignIn, location]);

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
