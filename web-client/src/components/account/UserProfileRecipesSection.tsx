import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  TSelectedFilters,
  SortParams,
  defaultSort,
  DefaultFilters,
} from "../../slices/filtersSlice";

interface propTypes {
  userId: string;
}
const UserProfileRecipesSection: FC<propTypes> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<TRecipe[]>();
  const [filtered, setFiltered] = useState<boolean>(false);
  const [filteredFromChip, setFilteredFromChip] = useState<boolean>(false);

  const [selectedFilters, setSelectedFilters] =
    useState<TSelectedFilters>(DefaultFilters);

  const [sort, setSort] = useState<SortParams>(defaultSort);

  const [searchText, setSearchText] = useState<string>("");

  const [fetching, setFetching] = useState(false);

  // update a specific recipe in the local recipes state
  const updateRecipe = useCallback(
    (updatedRecipe: TRecipe) => {
      let updatedRecipes = recipes?.map((recipe: TRecipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      );
      setRecipes(updatedRecipes);
    },
    [recipes]
  );

  // used to trigger getRecipes when filtering recipes through recipe chips
  const chipsFilterFunction = useCallback((filters: TSelectedFilters) => {
    setFilteredFromChip(true);
    setSelectedFilters(filters);
  }, []);

  // we use a ref here so that local would not change between renders and cause a rerender,
  // even if the contents of local are not changing the local object itself does.
  const local = useRef<{
    setRecipe?: (updatedRecipe: TRecipe) => void;
    chipsFilterFunction?: Function;
  }>({
    setRecipe: updateRecipe,
    chipsFilterFunction: chipsFilterFunction,
  });

  const getRecipes = async (
    filters: TSelectedFilters,
    sortParams: SortParams
  ) => {
    setRecipes([]);
    setFetching(true);
    try {
      let result = await axios.post("/api/recipes/filter", {
        searchText: searchText || undefined,
        filters: {
          favorited_by: favoritesOnly ? userId : undefined,
          owner: favoritesOnly ? undefined : userId,
          private: false, //api will automatically apply this but just in case
          ...(filters ? filters : selectedFilters),
        },
        sort: sortParams ? sortParams : sort,
      });

      if (filters) {
        if (!filteredFromChip) {
          setSelectedFilters(filters);
        }
        setFiltered(
          Object.values(filters).some(
            (filter) => typeof filter !== "undefined"
          ) || JSON.stringify(sortParams) !== JSON.stringify(defaultSort)
        );
      }
      if (sortParams) {
        setSort(sortParams);
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

  // this executes the getRecipes function when the chips filter flag is on and a filter has changed
  useEffect(() => {
    if (filteredFromChip) {
      getRecipes(selectedFilters, sort).then((_) => setFilteredFromChip(false));
    }
  }, [selectedFilters, sort]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (favoritesOnly) {
      dispatch(setTitleFilters({ favorited_by: userId, private: false }));
    } else {
      dispatch(setTitleFilters({ owner: userId, private: false }));
    }
    getRecipes(selectedFilters, sort);
  }, [userId, favoritesOnly]);

  //reset local state when userid changes
  useEffect(() => {
    setFavoritesOnly(false);
    setSelectedFilters({
      category: undefined,
      sub_category: undefined,
      difficulty: undefined,
      prep_time: undefined,
      total_time: undefined,
    });
    setSort(defaultSort);
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
            sort,
          }}
        />
      </div>
      {recipes && (
        <Recipes
          loading={fetching}
          approvalRequiredOnly={false}
          recipes={recipes}
          local={local.current}
        />
      )}
    </div>
  );
};

export default UserProfileRecipesSection;
