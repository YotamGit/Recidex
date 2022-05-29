import "../styles/Main.css";
import Recipes from "./recipes/Recipes";
import RecipesPrivacySelector from "./recipes/RecipesPrivacySelector";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//redux
import { useAppDispatch, useAppSelector } from "../hooks";
import { getRecipes } from "../slices/recipesSlice";
import {
  setTitleFilters,
  setPrivacyState,
  setOwnerOnly,
  setFavoritesOnly,
  setApprovedOnly,
  setApprovalRequiredOnly,
} from "../slices/filtersSlice";

//mui
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

//types
import { FC } from "react";
import { TRecipe } from "../slices/recipesSlice";
import { recipePrivacyState } from "../slices/filtersSlice";

interface propTypes {
  ownerOnly: boolean;
  favoritesOnly: boolean;
  approvedOnly: boolean;
  approvalRequiredOnly: boolean;
}

const Main: FC<propTypes> = ({
  ownerOnly,
  favoritesOnly,
  approvedOnly,
  approvalRequiredOnly,
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [fetching, setFetching] = useState(false);
  const [recipePrivacy, setRecipePrivacy] = useState<recipePrivacyState>("all");

  const recipes = useAppSelector((state) => state.recipes.recipes);
  const fetchedAllRecipes = useAppSelector(
    (state) => state.recipes.fetchedAllRecipes
  );

  const user_id = useAppSelector((state) => state.users.userData._id);
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
      dispatch(setFavoritesOnly(favoritesOnly));
      dispatch(setApprovedOnly(approvedOnly));
      dispatch(setApprovalRequiredOnly(approvalRequiredOnly));
      dispatch(setOwnerOnly(ownerOnly));
      if (ownerOnly) {
        dispatch(setPrivacyState(recipePrivacy));
      }
      initialRecipesLoad();
    }

    //set title filters for search
    if (ownerOnly) {
      dispatch(setTitleFilters({ owner: user_id }));
    } else if (favoritesOnly) {
      dispatch(setTitleFilters({ favorited_by: user_id, private: false }));
    } else if (approvedOnly) {
      dispatch(setTitleFilters({ approved: true, private: false }));
    } else if (approvalRequiredOnly) {
      dispatch(setTitleFilters({ approval_required: true, private: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ownerOnly,
    favoritesOnly,
    approvalRequiredOnly,
    approvedOnly,
    attemptSignIn,
    location,
    recipePrivacy,
  ]);

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
    <div className="main">
      {ownerOnly && (
        <RecipesPrivacySelector
          setRecipePrivacy={setRecipePrivacy}
          recipePrivacy={recipePrivacy}
        />
      )}
      {recipes.length > 0 ? (
        <>
          <Recipes
            recipes={recipes}
            approvalRequiredOnly={approvalRequiredOnly}
          />
        </>
      ) : (
        <Button
          className="primary"
          variant="contained"
          component="div"
          style={{ marginTop: "10px" }}
          onClick={async () => {
            recipes.length > 0
              ? await loadRecipes()
              : await initialRecipesLoad();
          }}
        >
          Load Recipes
        </Button> //show skeleton loading animation if fetching is true
      )}
      {!fetchedAllRecipes && (
        <div>
          {fetching ? (
            <CircularProgress />
          ) : (
            <Button
              className="primary"
              variant="contained"
              component="div"
              onClick={async () => {
                recipes.length > 0
                  ? await loadRecipes()
                  : await initialRecipesLoad();
              }}
            >
              Load More Recipes
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Main;
