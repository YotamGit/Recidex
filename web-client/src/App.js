import axios from "axios";
import Button from "./components/Button";
import Search from "./components/Search";
import { useState, useEffect } from "react";
import RecipePage from "./components/RecipePage";
import RecipeEditorPage from "./components/RecipeEditorPage";
import AddRecipe from "./components/AddRecipe";
import Header from "./components/Header";
import Main from "./components/Main";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
function App() {
  const [recipes, setRecipes] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    getRecipes();
    console.log(recipes);
  }, []);

  const onRecipeSearch = (text) => {
    setSearch(text);
  };

  const getRecipes = async () => {
    const res = await axios
      .get("http://localhost:3000/api/recipes/")
      .then((result) => {
        console.log(result.data);
        setRecipes(result.data);
      })
      .catch((error) => console.log(error));
    // setRecipes([
    //   {
    //     id: "1",
    //     title: "Corn Dogs",
    //     category: "Pasta",
    //     difficulty: "Easy",
    //     duration: "20-40 minutes",
    //     description:
    //       "I made up this recipe many years ago, because I loved the corn dogs you buy at carnivals but could not find a recipe for them. Great served with mustard. ",
    //     ingredients: `* 1 cup yellow cornmeal
    //     \n* 1 cup all-purpose flour
    //     \n* <sup>1</sup>/<sub>4</sub> teaspoon salt
    //     \n* <sup>1</sup>/<sub>8</sub> teaspoon black pepper
    //     \n* <sup>1</sup>/<sub>4</sub> cup white sugar
    //     \n* 4 teaspoons baking soda
    //     \n* 1 egg
    //     \n* 1 cup milk
    //     \n* 1 quart vegetable oil for frying
    //     \n* 2 (16 ounce) packages beef frankfurters
    //     \n* 16 wooden skewers`,
    //     directions: `### Step 1
    //     \nIn a medium bowl, combine cornmeal, flour, salt, pepper, sugar and baking powder. Stir in eggs and milk.
    //     \n### Step 2
    //     \nPreheat oil in a deep saucepan over medium heat. Insert wooden skewers into frankfurters. Roll frankfurters in batter until well coated.
    //     \n### Step 3
    //     \nFry 2 or 3 corn dogs at a time until lightly browned, about 3 minutes. Drain on paper towels.`,
    //     rtl: false,
    //     source: "sample source 1",
    //     image: "",
    //   },
    //   {
    //     id: "2",
    //     title: "עוגיות שוקולד צ'יפס",
    //     category: "Desserts",
    //     difficulty: "Very Hard",
    //     duration: "20-40 minutes",
    //     description:
    //       "מתכון לעוגיות שוקולד צ'יפס קלות להכנה והכי טעימות שיש! פשוט מערבבים את כל המצרכים, מסדרים ואופים. 10 דקות עבודה ועוד 15 דקות אפייה ויש לכם עוגיות מושלמות. ניתן להכין עם חמאה או שמן (לעוגיות חלביות או פרווה).",
    //     ingredients: `* 200 גר' חמאה מומסת / 160 מ"ל שמן (שני שליש כוס) לפרווה
    //     \n* 2 כוסות קמח + 4 כפות
    //     \n* 1 כפית אבקת אפייה
    //     \n* 1/2 כפית סודה לשתייה
    //     \n* 1 כוס שבבי שוקולד צ'יפס חלב / מריר / לבן
    //     \n* 3/4 כוס סוכר חום
    //     \n* 1/4 כוס סוכר לבן
    //     \n* 2 ביצים m`,
    //     directions: `### שלב 1
    //     \nאת כל מצרכי העוגיות נלוש היטב בקערה עד לקבלת בצק עוגיות נוח.
    //     \n### שלב 2
    //     \nנרפד תבנית בנייר אפייה, ניצור מבצק העוגיות כדורים בגודל כדור פינג פינג ונסדר (עם רווחים) על התבנית.
    //     \n### שלב 3
    //     \n נאפה את העוגיות בתנור חם על 170 מעלות במשך כ רבע שעה, העוגיות מוכנות כשהן זהובות ויפות.`,
    //     rtl: true,
    //     source: "sample source2",
    //     image: "",
    //   },
    //   {
    //     id: "3",
    //     title: "Corn Dogs",
    //     category: "Curry",
    //     difficulty: "Very Easy",
    //     duration: "20-40 minutes",
    //     description:
    //       "I made up this recipe many years ago, because I loved the corn dogs you buy at carnivals but could not find a recipe for them. Great served with mustard. ",
    //     ingredients: `* 1 cup yellow cornmeal
    //     \n* 1 cup all-purpose flour
    //     \n* <sup>1</sup>/<sub>4</sub> teaspoon salt
    //     \n* <sup>1</sup>/<sub>8</sub> teaspoon black pepper
    //     \n* <sup>1</sup>/<sub>4</sub> cup white sugar
    //     \n* 4 teaspoons baking soda
    //     \n* 1 egg
    //     \n* 1 cup milk
    //     \n* 1 quart vegetable oil for frying
    //     \n* 2 (16 ounce) packages beef frankfurters
    //     \n* 16 wooden skewers`,
    //     directions: `### Step 1
    //     \nIn a medium bowl, combine cornmeal, flour, salt, pepper, sugar and baking powder. Stir in eggs and milk.
    //     \n### Step 2
    //     \nPreheat oil in a deep saucepan over medium heat. Insert wooden skewers into frankfurters. Roll frankfurters in batter until well coated.
    //     \n### Step 3
    //     \nFry 2 or 3 corn dogs at a time until lightly browned, about 3 minutes. Drain on paper towels.`,
    //     rtl: false,
    //     source: "sample source 1",
    //     image: "",
    //   },
    //   {
    //     id: "4",
    //     title: "pasta curry",
    //     category: "Curry",
    //     difficulty: "Very Easy",
    //     duration: "20-40 minutes",
    //     description:
    //       "I made up this recipe many years ago, because I loved the corn dogs you buy at carnivals but could not find a recipe for them. Great served with mustard. ",
    //     ingredients: `* 1 cup yellow cornmeal
    //     \n* 1 cup all-purpose flour
    //     \n* <sup>1</sup>/<sub>4</sub> teaspoon salt
    //     \n* <sup>1</sup>/<sub>8</sub> teaspoon black pepper
    //     \n* <sup>1</sup>/<sub>4</sub> cup white sugar
    //     \n* 4 teaspoons baking soda
    //     \n* 1 egg
    //     \n* 1 cup milk
    //     \n* 1 quart vegetable oil for frying
    //     \n* 2 (16 ounce) packages beef frankfurters
    //     \n* 16 wooden skewers`,
    //     directions: `### Step 1
    //     \nIn a medium bowl, combine cornmeal, flour, salt, pepper, sugar and baking powder. Stir in eggs and milk.
    //     \n### Step 2
    //     \nPreheat oil in a deep saucepan over medium heat. Insert wooden skewers into frankfurters. Roll frankfurters in batter until well coated.
    //     \n### Step 3
    //     \nFry 2 or 3 corn dogs at a time until lightly browned, about 3 minutes. Drain on paper towels.`,
    //     rtl: false,
    //     source: "sample source 1",
    //     image: "",
    //   },
    //   {
    //     id: "5",
    //     title: "yummy pasta",
    //     category: "Pasta",
    //     difficulty: "Very Easy",
    //     duration: "20-40 minutes",
    //     description:
    //       "I made up this recipe many years ago, because I loved the corn dogs you buy at carnivals but could not find a recipe for them. Great served with mustard. ",
    //     ingredients: `* 1 cup yellow cornmeal
    //     \n* 1 cup all-purpose flour
    //     \n* <sup>1</sup>/<sub>4</sub> teaspoon salt
    //     \n* <sup>1</sup>/<sub>8</sub> teaspoon black pepper
    //     \n* <sup>1</sup>/<sub>4</sub> cup white sugar
    //     \n* 4 teaspoons baking soda
    //     \n* 1 egg
    //     \n* 1 cup milk
    //     \n* 1 quart vegetable oil for frying
    //     \n* 2 (16 ounce) packages beef frankfurters
    //     \n* 16 wooden skewers`,
    //     directions: `### Step 1
    //     \nIn a medium bowl, combine cornmeal, flour, salt, pepper, sugar and baking powder. Stir in eggs and milk.
    //     \n### Step 2
    //     \nPreheat oil in a deep saucepan over medium heat. Insert wooden skewers into frankfurters. Roll frankfurters in batter until well coated.
    //     \n### Step 3
    //     \nFry 2 or 3 corn dogs at a time until lightly browned, about 3 minutes. Drain on paper towels.`,
    //     rtl: false,
    //     source: "sample source 1",
    //     image: "",
    //   },
    // ]);
  };

  const onEditRecipe = async (recipeData) => {
    console.log(recipeData);
    const res = await axios
      .patch(`http://localhost:3000/api/recipes/${recipeData._id}`, recipeData)
      .then((result) =>
        setRecipes(
          recipes.map((recipe) =>
            recipe._id === recipeData._id ? recipeData : recipe
          )
        )
      )
      .catch((error) => console.log(error));
  };

  const deleteRecipe = async (id) => {
    var res = window.confirm(
      "Delete Recipe: " +
        recipes.filter((recipe) => recipe._id === id)[0].title +
        "?"
    );
    if (res) {
      const res = await axios
        .delete(`http://localhost:3000/api/recipes/${id}`)
        .then((result) => {
          setRecipes(recipes.filter((recipe) => recipe._id !== id));
        })
        .catch((error) => console.log(error));
    }
  };

  const onAddRecipe = async (recipe) => {
    delete recipe.id;
    const res = await axios
      .post(`http://localhost:3000/api/recipes/new`, recipe)
      .then((result) => {
        //setRecipes([...recipes, recipe]);
        getRecipes();
      })
      .catch((error) => console.log(error));
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
