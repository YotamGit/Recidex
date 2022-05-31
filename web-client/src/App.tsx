import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import ComponentWrapper from "./components/ComponentWrapper";

//redux
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  addRouteToHistory,
  setFullscreen,
  setCurrentPageTitle,
} from "./slices/utilitySlice";

import RecipePage from "./components/recipes/RecipePage";
import RecipeEditorPage from "./components/recipe_editor/RecipeEditorPage";
import AddRecipePage from "./components/recipe_editor/AddRecipePage";
import Header from "./components/app_bar/Header";
import Main from "./components/Main";
import Authentication from "./components/Login/Authentication";
import AdminPanel from "./components/admin/AdminPanel";
import AccountInfoPage from "./components/account/AccountInfoPage";
import UserProfilePage from "./components/account/UserProfilePage";
import AlertSnackbar from "./components/AlertSnackbar";

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

  const currentPageTitle = useAppSelector(
    (state) => state.utilities.currentPageTitle
  );
  // const routesPageTitlesMap = {
  //   "/": "Our Recipes",
  //   "/home": "Home",
  //   "/login": "Log In",
  //   "/signup": "Sign Up",
  //   "/my-recipes": "My Recipes",
  //   "/favorites": "Favorites",
  //   "/recipes/:recipe_id": "Recipe",
  //   "/recipes/edit/:recipe_id": "Edit Recipe",
  //   "/recipes/new": "Add Recipe",
  //   "/user/account": "Account",
  //   "/user/profile/:user_id": "User Profile",
  //   "/recipe-moderation": "Recipe Moderation",
  //   "/admin-panel": "Admin Panel",
  // };

  useEffect(() => {
    dispatch(addRouteToHistory(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    dispatch(setFullscreen(fullscreen));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen]);

  useEffect(() => {
    document.title = `Our Recipes${
      currentPageTitle !== "" ? ` | ${currentPageTitle}` : ""
    }`;
    console.log(location);
  }, [currentPageTitle, location]);

  return (
    <div>
      <ScrollToTop />
      <AlertSnackbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/login"
          element={
            <ComponentWrapper
              func={() => dispatch(setCurrentPageTitle("Log In"))}
            >
              <>
                <Authentication
                  action={"login"}
                  showSignAsGuest={true}
                  showOtherAuthOption={true}
                  navigateAfterLogin={true}
                />
              </>
            </ComponentWrapper>
          }
        />
        <Route
          path="/signup"
          element={
            <ComponentWrapper
              func={() => dispatch(setCurrentPageTitle("Sign Up"))}
            >
              <>
                <Authentication
                  action={"signup"}
                  showSignAsGuest={true}
                  showOtherAuthOption={true}
                  navigateAfterLogin={true}
                />
              </>
            </ComponentWrapper>
          }
        />
        <Route
          path="/home"
          element={
            <ComponentWrapper
              func={() => dispatch(setCurrentPageTitle("Home"))}
            >
              <>
                <Header pageName={"Home"} showSearch={true} />
                <Main
                  ownerOnly={false}
                  favoritesOnly={false}
                  approvedOnly={true}
                  approvalRequiredOnly={false}
                />
              </>
            </ComponentWrapper>
          }
        />

        <Route
          path="/my-recipes"
          element={
            <ProtectedRoute isAllowed={signedIn} redirectPath={"/home"}>
              <ComponentWrapper
                func={() => dispatch(setCurrentPageTitle("My Recipes"))}
              >
                <>
                  <Header pageName={"My Recipes"} showSearch={true} />
                  <Main
                    ownerOnly={true}
                    favoritesOnly={false}
                    approvedOnly={false}
                    approvalRequiredOnly={false}
                  />
                </>
              </ComponentWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute isAllowed={signedIn} redirectPath={"/home"}>
              <ComponentWrapper
                func={() => dispatch(setCurrentPageTitle("Favorites"))}
              >
                <>
                  <Header pageName={"Favorites"} showSearch={true} />
                  <Main
                    ownerOnly={false}
                    favoritesOnly={true}
                    approvedOnly={false}
                    approvalRequiredOnly={false}
                  />
                </>
              </ComponentWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/:recipe_id"
          element={
            <ComponentWrapper
              func={() => dispatch(setCurrentPageTitle("Recipe"))}
            >
              <>
                <Header pageName={"Recipe"} showSearch={false} />
                <RecipePage />
              </>
            </ComponentWrapper>
          }
        />
        <Route
          path="/recipes/edit/:recipe_id"
          element={
            <ComponentWrapper
              func={() => dispatch(setCurrentPageTitle("Edit Recipe"))}
            >
              <>
                <Header pageName={"Edit Recipe"} showSearch={false} />
                <RecipeEditorPage />
              </>
            </ComponentWrapper>
          }
        />

        <Route
          path="/recipes/new"
          element={
            <ComponentWrapper
              func={() => dispatch(setCurrentPageTitle("Add Recipe"))}
            >
              <>
                <Header pageName={"Add Recipe"} showSearch={false} />
                <AddRecipePage />
              </>
            </ComponentWrapper>
          }
        />

        <Route
          path="/user/account"
          element={
            <ProtectedRoute isAllowed={signedIn} redirectPath={"/home"}>
              <ComponentWrapper
                func={() => dispatch(setCurrentPageTitle("Account"))}
              >
                <>
                  <Header pageName={"Account"} showSearch={false} />
                  <AccountInfoPage />
                </>
              </ComponentWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile/:user_id"
          element={
            <ComponentWrapper
              func={() => dispatch(setCurrentPageTitle("User Profile"))}
            >
              <>
                <Header pageName={"User Profile"} showSearch={false} />
                <UserProfilePage />
              </>
            </ComponentWrapper>
          }
        />

        <Route
          path="/recipe-moderation"
          element={
            <ProtectedRoute
              isAllowed={["admin", "moderator"].includes(userRole || "")}
              redirectPath={"/home"}
            >
              <ComponentWrapper
                func={() => dispatch(setCurrentPageTitle("Recipe Moderation"))}
              >
                <>
                  <Header pageName={"Recipe Moderation"} showSearch={true} />
                  <Main
                    ownerOnly={false}
                    favoritesOnly={false}
                    approvedOnly={false}
                    approvalRequiredOnly={true}
                  />
                </>
              </ComponentWrapper>
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
              <ComponentWrapper
                func={() => dispatch(setCurrentPageTitle("Admin Panel"))}
              >
                <>
                  <Header pageName={"Admin Panel"} showSearch={false} />
                  <AdminPanel />
                </>
              </ComponentWrapper>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
