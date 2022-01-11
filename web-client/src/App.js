import axios from "axios";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// import Search from "./components/Search";
import RecipePage from "./components/recipes/RecipePage";
import RecipeEditorPage from "./components/recipe_editor/RecipeEditorPage";
import AddRecipe from "./components/recipe_editor/AddRecipe";
import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  const [recipes, setRecipes] = useState([]);

  // const [search, setSearch] = useState("");

  useEffect(() => {
    getRecipes({ latest: new Date(), count: 4 });

    window.alert(
      "This is a Production Build, ANY Changes are saved Permanently."
    );
  }, []);

  const getRecipes = async (params) => {
    try {
      var result = await axios.get("/api/recipes", { params: params });
      setRecipes([...recipes, ...result.data]);
      return result.data.length;
    } catch (error) {
      window.alert("Failed to Fetch Recipes.\nReason: " + error.message);
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
      await axios.post(`/api/recipes/new`, recipe);
      getRecipes();
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
