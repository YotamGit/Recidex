import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollToTop from "./components/utilities/ScrollToTop";
import ProtectedRoute from "./components/utilities/ProtectedRoute";
import ComponentWrapper from "./components/utilities/ComponentWrapper";

//redux
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  addRouteToHistory,
  setFullscreen,
  setCurrentPageTitle,
} from "./slices/utilitySlice";

import Header from "./components/app_bar/Header";
import RecipePage from "./components/recipes/RecipePage";
import RecipeEditorPage from "./components/recipe_editor/RecipeEditorPage";
import AddRecipePage from "./components/recipe_editor/AddRecipePage";
import BaseRecipesPage from "./components/BaseRecipesPage";
import Authentication from "./components/login/Authentication";
import ForgotCredentialsPage from "./components/login/ForgotCredentialsPage";
import ResetPasswordPage from "./components/login/ResetPasswordPage";
import AdminPanelPage from "./components/admin/AdminPanelPage";
import AccountInfoPage from "./components/account/AccountInfoPage";
import UserProfilePage from "./components/account/UserProfilePage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import NotFoundPage from "./components/NotFoundPage";

import AlertSnackbar from "./components/utilities/AlertSnackbar";

//mui
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export const MAIN_RECIDEX_ROUTES = [
  "/home",
  "/my-recipes",
  "/favorites",
  "/recipe-moderation",
];

export const MODERATOR_ROLES = ["moderator", "admin"];

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

  useEffect(() => {
    dispatch(
      addRouteToHistory({
        pathname: location.pathname,
        key: location.key,
      })
    );
    window.scrollTo({
      top: 0,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    dispatch(setFullscreen(fullscreen));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreen]);

  useEffect(() => {
    document.title = `Recidex${
      currentPageTitle !== "" ? ` | ${currentPageTitle}` : ""
    }`;
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
            <ProtectedRoute isAllowed={!signedIn} redirectPath={"/home"}>
              <ComponentWrapper
                func={() => dispatch(setCurrentPageTitle("Log In"))}
              >
                <>
                  <Header showLogo={false} showSearch={false} />

                  <Authentication
                    action={"login"}
                    showSignAsGuest={true}
                    showOtherAuthOption={true}
                    navigateAfterLogin={true}
                  />
                </>
              </ComponentWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedRoute isAllowed={!signedIn} redirectPath={"/home"}>
              <ComponentWrapper
                func={() => dispatch(setCurrentPageTitle("Sign Up"))}
              >
                <>
                  <Header showLogo={false} showSearch={false} />
                  <Authentication
                    action={"signup"}
                    showSignAsGuest={true}
                    showOtherAuthOption={true}
                    navigateAfterLogin={true}
                  />
                </>
              </ComponentWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-credentials/:type"
          element={
            <ProtectedRoute isAllowed={!signedIn} redirectPath={"/home"}>
              <ComponentWrapper
                func={() => dispatch(setCurrentPageTitle("Forgot Credentials"))}
              >
                <>
                  <Header showLogo={false} showSearch={false} />
                  <ForgotCredentialsPage />
                </>
              </ComponentWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <ComponentWrapper
              func={() => dispatch(setCurrentPageTitle("Reset Password"))}
            >
              <>
                <Header showLogo={false} showSearch={false} />
                <ResetPasswordPage />
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
                <Header showSearch={true} />
                <BaseRecipesPage
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
                  <Header showSearch={true} />
                  <BaseRecipesPage
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
                  <Header showSearch={true} />
                  <BaseRecipesPage
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
                <Header showSearch={false} />
                <RecipePage />
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
                <Header showSearch={false} />
                <AddRecipePage />
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
                <Header showSearch={false} />
                <RecipeEditorPage />
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
                  <Header showSearch={false} />
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
                <Header showSearch={false} />
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
                  <Header showSearch={true} />
                  <BaseRecipesPage
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
                  <Header showSearch={false} />
                  <AdminPanelPage />
                </>
              </ComponentWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <ComponentWrapper
              func={() => dispatch(setCurrentPageTitle("Privacy Policy"))}
            >
              <>
                <Header showSearch={false} />
                <PrivacyPolicyPage />
              </>
            </ComponentWrapper>
          }
        />
        <Route
          path="*"
          element={
            <ComponentWrapper
              func={() => dispatch(setCurrentPageTitle("Not Found"))}
            >
              <>
                <Header showSearch={false} />
                <NotFoundPage />
              </>
            </ComponentWrapper>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
