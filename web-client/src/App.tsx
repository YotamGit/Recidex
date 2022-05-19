import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

//redux
import { useAppDispatch, useAppSelector } from "./hooks";
import { addRouteToHistory, setFullscreen } from "./slices/utilitySlice";

import ProtectedRoute from "./components/ProtectedRoute";

import RecipePage from "./components/recipes/RecipePage";
import RecipeEditorPage from "./components/recipe_editor/RecipeEditorPage";
import AddRecipe from "./components/recipe_editor/AddRecipe";
import Header from "./components/app_bar/Header";
import Main from "./components/Main";
import Authentication from "./components/Login/Authentication";
import AdminPanel from "./components/admin/AdminPanel";
import AccountInfoPage from "./components/account/AccountInfoPage";
import UserProfilePage from "./components/account/UserProfilePage";

//mui
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  //if we use the store, the protected routes get calculated before the
  //data is retrieved from the store and results in a false statement.
  //using localstorage to get the immediate values solves the issue.
  const signedIn = Boolean(localStorage.getItem("signedIn"));
  const userRole = localStorage.getItem("userRole");

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
              <Main
                ownerOnly={false}
                favoritesOnly={false}
                approvalRequiredOnly={false}
              />
            </>
          }
        />

        <Route
          path="/my-recipes"
          element={
            <ProtectedRoute isAllowed={signedIn} redirectPath={"/home"}>
              <>
                <Header pageName={"My Recipes"} showSearch={true} />
                <Main
                  ownerOnly={true}
                  favoritesOnly={false}
                  approvalRequiredOnly={false}
                />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute isAllowed={signedIn} redirectPath={"/home"}>
              <>
                <Header pageName={"Favorites"} showSearch={true} />
                <Main
                  ownerOnly={false}
                  favoritesOnly={true}
                  approvalRequiredOnly={false}
                />
              </>
            </ProtectedRoute>
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

        <Route
          path="/user/account"
          element={
            <ProtectedRoute isAllowed={signedIn} redirectPath={"/home"}>
              <>
                <Header pageName={"Account"} showSearch={false} />
                <AccountInfoPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile/:user_id"
          element={
            <>
              <Header pageName={"User Profile"} showSearch={false} />
              <UserProfilePage />
            </>
          }
        />

        <Route
          path="/recipe-moderation"
          element={
            <ProtectedRoute
              isAllowed={["admin", "moderator"].includes(userRole || "")}
              redirectPath={"/home"}
            >
              <>
                <Header pageName={"Recipe Moderation"} showSearch={true} />
                <Main
                  ownerOnly={false}
                  favoritesOnly={false}
                  approvalRequiredOnly={true}
                />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute
              isAllowed={["admin", "moderator"].includes(userRole || "")}
              redirectPath={"/home"}
            >
              <>
                <Header pageName={"Admin Panel"} showSearch={false} />
                <AdminPanel />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
