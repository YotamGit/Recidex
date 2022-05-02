import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";

//redux
import { useAppDispatch } from "./hooks";
import { addRouteToHistory, setFullscreen } from "./slices/utilitySlice";

import RecipePage from "./components/recipes/RecipePage";
import RecipeEditorPage from "./components/recipe_editor/RecipeEditorPage";
import AddRecipe from "./components/recipe_editor/AddRecipe";
import Header from "./components/Header";
import Main from "./components/Main";
import Authentication from "./components/Login/Authentication";

//mui
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const theme = useTheme();
  const fullscreen = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    dispatch(addRouteToHistory(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    dispatch(setFullscreen(fullscreen));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/login"
          element={
            <>
              <Authentication
                action={"login"}
                showSignAsGuest={true}
                showOtherAuthOption={true}
                navigateAfterLogin={true}
              />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Authentication
                action={"signup"}
                showSignAsGuest={true}
                showOtherAuthOption={true}
                navigateAfterLogin={true}
              />
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <Header pageName={"Home"} showSearch={true} />
              <Main ownerOnly={false} favoritesOnly={false} />
            </>
          }
        />
        <Route
          path="/my-recipes"
          element={
            <>
              <Header pageName={"My Recipes"} showSearch={true} />
              <Main ownerOnly={true} favoritesOnly={false} />
            </>
          }
        />
        <Route
          path="/favorites"
          element={
            <>
              <Header pageName={"Favorites"} showSearch={true} />
              <Main ownerOnly={false} favoritesOnly={true} />
            </>
          }
        />
        <Route
          path="/recipes/:recipe_id"
          element={
            <>
              <Header pageName={"Recipe"} showSearch={false} />

              <RecipePage />
            </>
          }
        />
        <Route
          path="/recipes/edit/:recipe_id"
          element={
            <>
              <Header pageName={"Edit Recipe"} showSearch={false} />
              <RecipeEditorPage />
            </>
          }
        />

        <Route
          path="/recipes/new"
          element={
            <>
              <Header pageName={"Add Recipe"} showSearch={false} />
              <AddRecipe />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
