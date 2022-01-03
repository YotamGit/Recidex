import axios from "axios";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Button from "./components/Button";
import Search from "./components/Search";
import RecipePage from "./components/RecipePage";
import RecipeEditorPage from "./components/RecipeEditorPage";
import AddRecipe from "./components/AddRecipe";
import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  const [recipes, setRecipes] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    getRecipes();
  }, []);

  const onRecipeSearch = (text) => {
    setSearch(text);
  };

  const getRecipes = async () => {
    await axios
      .get("http://localhost:3000/api/recipes/")
      .then((result) => {
        setRecipes(result.data);
      })
      .catch((error) => window.alert(error + "\nFailed to Fetch Recipes."));
  };

  const onEditRecipe = async (recipeData) => {
    await axios
      .patch(`http://localhost:3000/api/recipes/${recipeData._id}`, recipeData)
      .then((result) => {
        setRecipes(
          recipes.map((recipe) =>
            recipe._id === recipeData._id ? recipeData : recipe
          )
        );
      })
      .catch((error) => {
        throw new Error(
          error + "\nFailed to Edit Recipe In Database, Please Try Again."
        );
      });
  };

  const deleteRecipe = async (id) => {
    var remove = window.confirm(
      "Delete Recipe: " +
        recipes.filter((recipe) => recipe._id === id)[0].title +
        "?"
    );
    if (remove) {
      await axios
        .delete(`http://localhost:3000/api/recipes/${id}`)
        .then((result) => {
          setRecipes(recipes.filter((recipe) => recipe._id !== id));
        })
        .catch((error) => {
          throw new Error(
            error + "\nFailed to Delete Recipe From Database, Please Try Again."
          );
        });
    }
    return remove;
  };

  const onAddRecipe = async (recipe) => {
    delete recipe.id;
    await axios
      .post(`http://localhost:3000/api/recipes/new`, recipe)
      .then((result) => {
        getRecipes();
      })
      .catch((error) => {
        throw new Error(
          error + "\nFailed to Add Recipe To Database, Please Try Again."
        );
      });
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navigate to="/home" />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <Header onAddRecipe={onAddRecipe} />
                <Main
                  recipes={recipes}
                  getRecipes={getRecipes}
                  onEditRecipe={onEditRecipe}
                  deleteRecipe={deleteRecipe}
                />
              </>
            }
          />
          <Route
            path="/recipes/:recipe_id"
            element={
              <>
                <Header onAddRecipe={onAddRecipe} />
                <RecipePage
                  recipes={recipes}
                  deleteRecipe={deleteRecipe}
                  onEditRecipe={onEditRecipe}
                />
              </>
            }
          />
          <Route
            path="/recipes/edit/:recipe_id"
            element={
              <>
                <Header onAddRecipe={onAddRecipe} />
                <RecipeEditorPage
                  recipes={recipes}
                  onEditRecipe={onEditRecipe}
                  deleteRecipe={deleteRecipe}
                />
              </>
            }
          />

          <Route
            path="/recipes/new"
            element={
              <>
                <Header onAddRecipe={onAddRecipe} />
                <AddRecipe onAddRecipe={onAddRecipe} />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
