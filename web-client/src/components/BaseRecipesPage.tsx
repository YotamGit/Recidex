import "../styles/BaseRecipesPage.css";
import Recipes from "./recipes/Recipes";
import RecipesPrivacySelector from "./recipes/RecipesPrivacySelector";
import PageTitle from "./utilities/PageTitle";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { mainRecipesRoutes } from "../App";

//redux
import { useAppDispatch, useAppSelector } from "../hooks";
import { getRecipes, setRecipes } from "../slices/recipesSlice";
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

const BaseRecipesPage: FC<propTypes> = ({
  ownerOnly,
  favoritesOnly,
  approvedOnly,
  approvalRequiredOnly,
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [recipePrivacy, setRecipePrivacy] = useState<recipePrivacyState>(
    useAppSelector((state) => state.filters.privacyState)
  );

  const recipes = useAppSelector((state) => state.recipes.recipes);
  const fetchedAllRecipes = useAppSelector(
    (state) => state.recipes.fetchedAllRecipes
  );
  const fetching = useAppSelector((state) => state.recipes.fetching);

  const user_id = useAppSelector((state) => state.users.userData._id);
  const attemptSignIn = useAppSelector((state) => state.users.attemptSignIn);
  const routeHistory = useAppSelector((state) => state.utilities.routeHistory);

  const abortControllerRef = useRef<AbortController>(new AbortController());

  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  const loadRecipes = async () => {
    if (recipes.length > 0) {
      await dispatch(
        getRecipes({
          abortController: abortControllerRef.current,
          replace: false,
          args: {
            latest: recipes.at(-1)?.creation_time,
          },
        })
      );
    }
  };

  const initialRecipesLoad = async () => {
    try {
      await dispatch(
        getRecipes({
          abortController: abortControllerRef.current,
          replace: true,
        })
      );
    } catch (error) {}
  };

  useEffect(() => {
    //fetching while attempting to sign in might result in 2 fetch requests
    if (attemptSignIn) {
      return;
    }

    //making sure the current location and the store location are synchronized
    //in order to correctly determine whether to fetch recipes or not.
    if (routeHistory.slice(-1)[0].key !== location.key) {
      return;
    }

    let lastMainPageVisited = [...routeHistory]
      .slice(0, routeHistory.length - 1)
      .reverse()
      .find((element) =>
        mainRecipesRoutes.includes(element.pathname)
      )?.pathname;

    if (location.pathname !== lastMainPageVisited || ownerOnly) {
      dispatch(setFavoritesOnly(favoritesOnly));
      dispatch(setApprovedOnly(approvedOnly));
      dispatch(setApprovalRequiredOnly(approvalRequiredOnly));
      dispatch(setOwnerOnly(ownerOnly));
      if (ownerOnly) {
        dispatch(setPrivacyState(recipePrivacy));
      }
      //abort previous requests
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
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
  }, [attemptSignIn, recipePrivacy, location, routeHistory]);

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
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, fetchedAllRecipes, fetching]);

  return (
    <div className="base-recipes-page">
      <PageTitle marginTop={true} />
      {ownerOnly && (
        <RecipesPrivacySelector
          setRecipePrivacy={setRecipePrivacy}
          recipePrivacy={recipePrivacy}
        />
      )}

      <Recipes
        loading={fetching}
        recipes={recipes}
        approvalRequiredOnly={approvalRequiredOnly}
      />
      {recipes.length === 0 && !fetching && (
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
        </Button>
      )}
    </div>
  );
};

export default BaseRecipesPage;
