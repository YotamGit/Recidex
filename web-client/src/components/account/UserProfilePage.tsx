import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import SearchBar from "../app_bar/SearchBar";
import Recipes from "../recipes/Recipes";

//mui icons
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

//mui
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

//types
import { FC } from "react";
import { TRecipe } from "../../slices/recipesSlice";
import { TSelectedFilters } from "../../slices/filtersSlice";

const UserProfilePage: FC = () => {
  const navigate = useNavigate();

  const { user_id } = useParams();
  const [userData, setUserData] = useState<any>();

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
    axios
      .get(`/api/users/user/info/${user_id}`)
      .then((result) => setUserData(result.data));

    getRecipes(selectedFilters);
  }, []);

  return (
    <>
      <div className="user-profile-page-top-button-row">
        <Tooltip title="Go back" arrow>
          <IconButton onClick={() => navigate(-1)}>
            <KeyboardBackspaceIcon className="icon" />
          </IconButton>
        </Tooltip>
      </div>
      {"TOP BUTTON ROW"}
      {JSON.stringify(userData)}
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
      {/* {userData && (
        <UserProfile
          userInfo={userData.userInfo}
          userFavoriteRecipes={userData.userFavoriteRecipes}
          userRecipes={userData.userRecipes}
        />
      )} */}
    </>
  );
};

export default UserProfilePage;
