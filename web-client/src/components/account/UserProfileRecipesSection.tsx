import axios from "axios";
import { useEffect, useState } from "react";

import SearchBar from "../app_bar/SearchBar";
import Recipes from "../recipes/Recipes";
import TabPanel from "../TabPanel";

//mui
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";
import { TSelectedFilters } from "../../slices/filtersSlice";

interface propTypes {
  user_id: string;
}
const UserProfileRecipesSection: FC<propTypes> = ({ user_id }) => {
  const [favoritesOnly, setfavoritesOnly] = useState<boolean>(false);
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
      return true;
    } catch (err: any) {
      window.alert("Failed to Fetch Recipes.\nReason: " + err.message);
      return false;
    }
  };

  useEffect(() => {
    if (!user_id) {
      return;
    }
    getRecipes(selectedFilters);
  }, [user_id, favoritesOnly]);

  return (
    <div>
      <SearchBar
        localSearch={{
          getRecipes,
          filtered,
          setFiltered,
          searchText,
          setSearchText,
          selectedFilters,
        }}
      />
      <ToggleButtonGroup
        className="profile-favorites-filter-button-group"
        // style={{ marginTop: "5px" }}
        size="small"
        value={favoritesOnly}
        exclusive
        onChange={(e, value: boolean) =>
          value !== null && setfavoritesOnly(value)
        }
        aria-label="table mode"
      >
        <ToggleButton
          className="profile-favorites-filter-button"
          value={false}
          aria-label="all recipes"
        >
          All
        </ToggleButton>
        <ToggleButton
          className="profile-favorites-filter-button"
          value={true}
          aria-label="favorite recipes"
        >
          Favorites
        </ToggleButton>
      </ToggleButtonGroup>
      <div>{JSON.stringify(favoritesOnly)}</div>
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
