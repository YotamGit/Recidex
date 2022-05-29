import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/account/UserProfileRecipesSection.css";

import SearchBar from "../app_bar/SearchBar";
import Recipes from "../recipes/Recipes";

//mui
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
//redux
import { useAppDispatch } from "../../hooks";
import { setTitleFilters } from "../../slices/filtersSlice";
import { setAlert } from "../../slices/utilitySlice";

//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";
import { TSelectedFilters } from "../../slices/filtersSlice";

interface propTypes {
  user_id: string;
}
const UserProfileRecipesSection: FC<propTypes> = ({ user_id }) => {
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

  const getRecipes = async (filters: any) => {
    try {
      let result = await axios.get("/api/recipes", {
        params: {
          latest: new Date(),
          searchText: searchText || undefined,
          filters: {
            favorited_by: favoritesOnly ? user_id : undefined,
            owner: favoritesOnly ? undefined : user_id,
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
  };

  useEffect(() => {
    if (!user_id) {
      return;
    }
    if (favoritesOnly) {
      dispatch(setTitleFilters({ favorited_by: user_id, private: false }));
    } else {
      dispatch(setTitleFilters({ owner: user_id, private: false }));
    }
    getRecipes(selectedFilters);
  }, [user_id, favoritesOnly]);

  useEffect(() => {
    setFavoritesOnly(false);
    setSelectedFilters({
      category: undefined,
      sub_category: undefined,
      difficulty: undefined,
      prep_time: undefined,
      total_time: undefined,
    });
  }, [user_id]);

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
          approvalRequiredOnly={false}
          recipes={recipes}
          chipsFilterFunction={getRecipes}
        />
      )}
    </div>
  );
};

export default UserProfileRecipesSection;
