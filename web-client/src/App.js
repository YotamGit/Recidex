import axios from "axios";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import RecipePage from "./components/recipes/RecipePage";
import RecipeEditorPage from "./components/recipe_editor/RecipeEditorPage";
import AddRecipe from "./components/recipe_editor/AddRecipe";
import Header from "./components/Header";
import Main from "./components/Main";
import Login from "./components/Login";

//redux
import { useSelector, useDispatch } from "react-redux";
import { userPing, setSignedIn } from "./slices/usersSlice";
import { getRecipes, filterRecipes } from "./slices/recipesSlice";

function App() {
  const dispatch = useDispatch();
  const signedIn = useSelector((state) => state.users.signedIn);
  const [arecipes, setRecipes] = useState([]); //delete
  const recipes = useSelector((state) => state.recipes.recipes);
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({});
  const recipe_categories = {
    Proteins: ["Meat", "Chicken", "Fish", "Other"],
    Salads: [],
    Asian: ["Japanese", "Chinese", "Thai", "Indian", "Other"],
    "Soups and Stews": ["Clear Soup", "Thick Soup", "Stew", "Other"],
    Pasta: [],
    "Pizza and Focaccia": [],
    Bread: ["Salty Pastries", "Other"],
    Drinks: ["Hot", "Cold", "Alcohol", "Other"],
    Desserts: [
      "Cookies",
      "Yeast",
      "Cakes",
      "Tarts and Pies",
      "Cup",
      "Snacks and Candies",
    ],
    Other: [],
  };
  const recipe_difficulties = [
    "Very Easy",
    "Easy",
    "Medium",
    "Hard",
    "Very Hard",
    "Gordon Ramsay",
  ];
  const recipe_durations = [
    "under 10 minutes",
    "10-20 minutes",
    "20-40 minutes",
    "40-60 minutes",
    "1-2 hours",
    "over 2 hours",
  ];

  useEffect(() => {
    dispatch(getRecipes({ latest: new Date(), count: 4 }));
    dispatch(userPing());
  }, []);

  // const getRecipes = async (params) => {
  //   try {
  //     var result = await axios.get("/api/recipes", { params: params });
  //     //setRecipes([...recipes, ...result.data]);
  //     //result = number of recipes received
  //     return result.data.length;
  //   } catch (error) {
  //     window.alert("Failed to Fetch Recipes.\nReason: " + error.message);
  //   }
  // };

  // const filterRecipes = async (filters) => {
  //   setSearchFilters(filters);
  //   //if some of the values isnt undefined
  //   //if (!Object.values(filters).some((x) => typeof x !== "undefined")) return;

  //   try {
  //     var result = await axios.get("/api/recipes", {
  //       params: {
  //         latest: new Date(),
  //         count: 4,
  //         filters: filters,
  //       },
  //     });
  //     setRecipes([...result.data]);
  //     return result.data.length;
  //   } catch (error) {
  //     window.alert("Failed to Filter Recipes.\nReason: " + error.message);
  //   }
  // };

  // const searchRecipes = async (searchText) => {
  //   window.alert("Searching is Not Yet Available");
  // };

  const onEditRecipe = async (recipeData) => {
    try {
      await axios.patch(`/api/recipes/${recipeData._id}`, recipeData);

      setRecipes(
        recipes.map((recipe) =>
          recipe._id === recipeData._id ? recipeData : recipe
        )
      );
      return true;
    } catch (error) {
      if (error.response.status === 401) {
        window.alert(
          "Failed to Edit Recipe in Database.\nReason: " + error.response.data
        );
        navigate("/login");
        return false;
      } else {
        window.alert(
          "Failed to Edit Recipe in Database, Please Try Again.\nReason: " +
            error.message
        );
        return false;
      }
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`/api/recipes/${id}`);
      setRecipes(recipes.filter((recipe) => recipe._id !== id));
      return true;
    } catch (error) {
      if (error.response.status === 401) {
        window.alert(
          "Failed to Delete Recipe from Database.\nReason: " +
            error.response.data
        );
        navigate("/login");
        return false;
      } else {
        window.alert(
          "Failed to Delete Recipe from Database, Please Try Again.\nReason: " +
            error.message
        );
        return false;
      }
    }
  };

  const onAddRecipe = async (recipe) => {
    delete recipe._id;
    try {
      var result = await axios.post(`/api/recipes/new`, recipe);
      setRecipes([result.data, ...recipes]);
      return true;
    } catch (error) {
      if (error.response.status === 401) {
        window.alert(
          "Failed to Add Recipe to Database, Please Try Again.\nReason: " +
            error.response.data
        );
        navigate("/login");
        return false;
      } else {
        window.alert(
          "Failed to Add Recipe to Database, Please Try Again.\nReason: " +
            error.message
        );
      }
    }
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/login"
          element={
            <>
              <Login showSignAsGuest={true} navigateAfterLogin={true} />
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <Header
                show_add_button={true}
                show_search={true}
                recipe_categories={recipe_categories}
                recipe_difficulties={recipe_difficulties}
                recipe_durations={recipe_durations}
                filterRecipes={filterRecipes}
                onSearch={searchRecipes}
              />
              <Main
                recipes={recipes}
                searchFilters={searchFilters}
                getRecipes={getRecipes}
              />
            </>
          }
        />
        <Route
          path="/recipes/:recipe_id"
          element={
            <>
              <Header
                show_add_button={false}
                show_search={false}
                recipe_categories={recipe_categories}
                recipe_difficulties={recipe_difficulties}
                recipe_durations={recipe_durations}
                filterRecipes={filterRecipes}
                onSearch={searchRecipes}
              />

              <RecipePage recipes={recipes} />
            </>
          }
        />
        <Route
          path="/recipes/edit/:recipe_id"
          element={
            <>
              <Header
                show_add_button={false}
                show_search={false}
                recipe_categories={recipe_categories}
                recipe_difficulties={recipe_difficulties}
                recipe_durations={recipe_durations}
                filterRecipes={filterRecipes}
                onSearch={searchRecipes}
              />
              <RecipeEditorPage
                recipes={recipes}
                onEditRecipe={onEditRecipe}
                deleteRecipe={deleteRecipe}
                recipe_categories={recipe_categories}
                recipe_difficulties={recipe_difficulties}
                recipe_durations={recipe_durations}
              />
            </>
          }
        />

        <Route
          path="/recipes/new"
          element={
            <>
              <Header
                show_add_button={false}
                show_search={false}
                recipe_categories={recipe_categories}
                recipe_difficulties={recipe_difficulties}
                recipe_durations={recipe_durations}
                filterRecipes={filterRecipes}
                onSearch={searchRecipes}
              />
              <AddRecipe
                onAddRecipe={onAddRecipe}
                recipe_categories={recipe_categories}
                recipe_difficulties={recipe_difficulties}
                recipe_durations={recipe_durations}
              />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
