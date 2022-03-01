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
              />
              <Main />
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
              />

              <RecipePage />
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
              />
              <RecipeEditorPage
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
              />
              <AddRecipe
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
