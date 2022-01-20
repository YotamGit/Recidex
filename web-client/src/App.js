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

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
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
    getRecipes({ latest: new Date(), count: 4 });
    ping();
  }, []);

  const ping = async () => {
    try {
      var result = await axios.get("/api/login");
      setSignedIn(result); //check returned stuff
    } catch (error) {
      if (error.response.status === 401) {
        setSignedIn(false);
      } else {
        window.alert(
          "Error Trying to Log In Automatically.\nReason: " + error.message
        );
      }
    }
  };
  const getRecipes = async (params) => {
    try {
      //result = number of recipes received
      var result = await axios.get("/api/recipes", { params: params });
      setRecipes([...recipes, ...result.data]);
      return result.data.length;
    } catch (error) {
      window.alert("Failed to Fetch Recipes.\nReason: " + error.message);
    }
  };

  const filterRecipes = async (filters) => {
    setSearchFilters(filters);
    //if (!Object.values(filters).some((x) => typeof x !== "undefined")) return;
    var params = {
      latest: new Date(),
      count: 4,
      filters: filters,
    };
    try {
      var result = await axios.get("/api/recipes", { params: params });
      setRecipes([...result.data]);
      return result.data.length;
    } catch (error) {
      window.alert("Failed to Filter Recipes.\nReason: " + error.message);
    }
  };

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
              <Login
                setSignedIn={setSignedIn}
                showSignAsGuest={true}
                navigateAfterLogin={true}
              />
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <Header
                signedIn={signedIn}
                setSignedIn={setSignedIn}
                show_add_button={true}
                show_filter_button={true}
                recipe_categories={recipe_categories}
                recipe_difficulties={recipe_difficulties}
                recipe_durations={recipe_durations}
                filterRecipes={filterRecipes}
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
                signedIn={signedIn}
                setSignedIn={setSignedIn}
                show_add_button={false}
                show_filter_button={false}
                recipe_categories={recipe_categories}
                recipe_difficulties={recipe_difficulties}
                recipe_durations={recipe_durations}
                filterRecipes={filterRecipes}
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
                signedIn={signedIn}
                setSignedIn={setSignedIn}
                show_add_button={false}
                show_filter_button={false}
                recipe_categories={recipe_categories}
                recipe_difficulties={recipe_difficulties}
                recipe_durations={recipe_durations}
                filterRecipes={filterRecipes}
              />
              <RecipeEditorPage
                signedIn={signedIn}
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
                signedIn={signedIn}
                setSignedIn={setSignedIn}
                show_add_button={false}
                show_filter_button={false}
                recipe_categories={recipe_categories}
                recipe_difficulties={recipe_difficulties}
                recipe_durations={recipe_durations}
                filterRecipes={filterRecipes}
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
