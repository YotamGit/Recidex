import axios from "axios";
import Cookies from "universal-cookie";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import RecipePage from "./components/recipes/RecipePage";
import RecipeEditorPage from "./components/recipe_editor/RecipeEditorPage";
import AddRecipe from "./components/recipe_editor/AddRecipe";
import Header from "./components/Header";
import Main from "./components/Main";
import Login from "./components/Login";

function App() {
  const [signedIn, setSignedIn] = useState(false);
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
    if (signedIn) {
      getRecipes({ latest: new Date(), count: 4 });
    }
  }, [signedIn]);

  const getRecipes = async (params) => {
    try {
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
    } catch (error) {
      throw new Error(
        "Failed to Edit Recipe In Database, Please Try Again.\nReason: " +
          error.message
      );
    }
  };

  const deleteRecipe = async (id) => {
    var remove = window.confirm(
      "Delete Recipe: " +
        recipes.filter((recipe) => recipe._id === id)[0].title +
        "?"
    );
    if (remove) {
      try {
        await axios.delete(`/api/recipes/${id}`);
        setRecipes(recipes.filter((recipe) => recipe._id !== id));
      } catch (error) {
        throw new Error(
          "Failed to Delete Recipe From Database, Please Try Again.\nReason: " +
            error.message
        );
      }
    }
    return remove;
  };

  const onAddRecipe = async (recipe) => {
    delete recipe._id;
    try {
      var result = await axios.post(`/api/recipes/new`, recipe);
      setRecipes([result.data, ...recipes]);
    } catch (error) {
      throw new Error(
        "Failed to Add Recipe To Database, Please Try Again.\nReason: " +
          error.message
      );
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              signedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Login setSignedIn={setSignedIn} />
              </>
            }
          />
          <Route
            path="/home"
            element={
              signedIn ? (
                <>
                  <Header
                    show_add_button={true}
                    filterRecipes={filterRecipes}
                    show_filter_button={true}
                    recipe_categories={recipe_categories}
                    recipe_difficulties={recipe_difficulties}
                    recipe_durations={recipe_durations}
                  />
                  <Main
                    recipes={recipes}
                    searchFilters={searchFilters}
                    getRecipes={getRecipes}
                  />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/recipes/:recipe_id"
            element={
              signedIn ? (
                <>
                  <Header
                    filterRecipes={filterRecipes}
                    show_add_button={false}
                    show_filter_button={false}
                    recipe_categories={recipe_categories}
                    recipe_difficulties={recipe_difficulties}
                    recipe_durations={recipe_durations}
                  />

                  <RecipePage recipes={recipes} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/recipes/edit/:recipe_id"
            element={
              signedIn ? (
                <>
                  <Header
                    filterRecipes={filterRecipes}
                    show_add_button={false}
                    show_filter_button={false}
                    recipe_categories={recipe_categories}
                    recipe_difficulties={recipe_difficulties}
                    recipe_durations={recipe_durations}
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
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/recipes/new"
            element={
              signedIn ? (
                <>
                  <Header
                    show_add_button={false}
                    show_filter_button={false}
                    recipe_categories={recipe_categories}
                    recipe_difficulties={recipe_difficulties}
                    recipe_durations={recipe_durations}
                  />
                  <AddRecipe
                    onAddRecipe={onAddRecipe}
                    recipe_categories={recipe_categories}
                    recipe_difficulties={recipe_difficulties}
                    recipe_durations={recipe_durations}
                  />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
