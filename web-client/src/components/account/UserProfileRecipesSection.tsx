import axios from "axios";
import { useEffect, useState } from "react";

import SearchBar from "../app_bar/SearchBar";
import Recipes from "../recipes/Recipes";
import TabPanel from "../TabPanel";

//mui
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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
          favoritesOnly: favoritesOnly || undefined,
          searchText: searchText || undefined,
          filters: {
            ...(filters ? filters : selectedFilters),
            owner: user_id,
            private: false,
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
    getRecipes(selectedFilters);
  }, []);
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
