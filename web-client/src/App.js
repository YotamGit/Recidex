import { Navigate, Route, Routes } from "react-router-dom";

import RecipePage from "./components/recipes/RecipePage";
import RecipeEditorPage from "./components/recipe_editor/RecipeEditorPage";
import AddRecipe from "./components/recipe_editor/AddRecipe";
import Header from "./components/Header";
import Main from "./components/Main";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";

function App() {
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
          path="/signup"
          element={
            <>
              <Signup showSignAsGuest={true} navigateAfterLogin={true} />
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <Header show_search={true} />
              <Main ownerOnly={false} />
            </>
          }
        />
        <Route
          path="/my-recipes"
          element={
            <>
              <Header show_search={true} />
              <Main ownerOnly={true} favoritesOnly={false} />
            </>
          }
        />
        <Route
          path="/favorites"
          element={
            <>
              <Header show_search={true} />
              <Main ownerOnly={true} favoritesOnly={true} />
            </>
          }
        />
        <Route
          path="/recipes/:recipe_id"
          element={
            <>
              <Header show_search={false} />

              <RecipePage />
            </>
          }
        />
        <Route
          path="/recipes/edit/:recipe_id"
          element={
            <>
              <Header show_search={false} />
              <RecipeEditorPage />
            </>
          }
        />

        <Route
          path="/recipes/new"
          element={
            <>
              <Header show_search={false} />
              <AddRecipe />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
