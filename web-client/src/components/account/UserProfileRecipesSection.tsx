import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/account/UserProfileRecipesSection.css";

import SearchBar from "../app_bar/SearchBar";
import Recipes from "../recipes/Recipes";

//mui
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
//redux
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setTitleFilters } from "../../slices/filtersSlice";
import { setAlert } from "../../slices/utilitySlice";

//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";
import { TSelectedFilters } from "../../slices/filtersSlice";

interface propTypes {
  userId: string;
}
const UserProfileRecipesSection: FC<propTypes> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<TRecipe[]>();
  const [filtered, setFiltered] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<TSelectedFilters>({
    category: undefined,
    sub_category: undefined,
    difficulty: undefined,
    prep_time: undefined,
    total_time: undefined,
  });
  const [searchText, setSearchText] = useState<string>("");

  const [fetching, setFetching] = useState(false);

  const updateRecipe = (updatedRecipe: TRecipe) => {
    let updatedRecipes = recipes?.map((recipe: TRecipe) =>
      recipe._id === updatedRecipe._id ? updatedRecipe : recipe
    );
    setRecipes(updatedRecipes);
  };

  const getRecipes = async (filters: any) => {
    setRecipes([]);
    setFetching(true);
    try {
      let result = await axios.get("/api/recipes", {
        params: {
          latest: new Date(),
          searchText: searchText || undefined,
          filters: {
            favorited_by: favoritesOnly ? userId : undefined,
            owner: favoritesOnly ? undefined : userId,
            private: false,
            ...(filters ? filters : selectedFilters),
          },
        },
      });
      if (filters) {
        setSelectedFilters(filters);
        setFiltered(
          Object.values(filters).some((filter) => typeof filter !== "undefined")
        );
      }
      setRecipes(result.data);
    } catch (err: any) {
      dispatch(
        setAlert({
          severity: "error",
          title: "Error",
          message: "Failed to fetch recipes.",
          details: err.response.data ? err.response?.data : undefined,
        })
      );
    }
    setFetching(false);
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    if (favoritesOnly) {
      dispatch(setTitleFilters({ favorited_by: userId, private: false }));
    } else {
      dispatch(setTitleFilters({ owner: userId, private: false }));
    }
    getRecipes(selectedFilters);
  }, [userId, favoritesOnly]);

  useEffect(() => {
    setFavoritesOnly(false);
    setSelectedFilters({
      category: undefined,
      sub_category: undefined,
      difficulty: undefined,
      prep_time: undefined,
      total_time: undefined,
    });
  }, [userId]);

  return (
    <div className="profile-recipes-section">
      <div className="filters-container">
        <ToggleButtonGroup
          className="profile-favorites-filter-button-group"
          size="small"
          value={favoritesOnly}
          exclusive
          onChange={(e, value: boolean) =>
            value !== null && setFavoritesOnly(value)
          }
          aria-label="table mode"
        >
          <ToggleButton
            className="profile-favorites-filter-button"
            value={false}
            aria-label="owned recipes"
          >
            Owned
          </ToggleButton>
          <ToggleButton
            className="profile-favorites-filter-button"
            value={true}
            aria-label="favorite recipes"
          >
            Favorites
          </ToggleButton>
        </ToggleButtonGroup>
        <SearchBar
          responsive={false}
          localSearch={{
            getRecipes,
            filtered,
            setFiltered,
            searchText,
            setSearchText,
            selectedFilters,
          }}
        />
      </div>
      {recipes && (
        <Recipes
          loading={fetching}
          approvalRequiredOnly={false}
          recipes={recipes}
          local={{ setRecipe: updateRecipe, chipsFilterFunction: getRecipes }}
        />
      )}
    </div>
  );
};

export default UserProfileRecipesSection;
