import Button from "./components/Button";
import Search from "./components/Search";
import { useEffect, useState } from "react";
import Recipes from "./components/Recipes";

function App() {
  const [recipes, setRecipes] = useState([
    {
      id: "1",
      title: "Corn Dogs",
      description:
        "I made up this recipe many years ago, because I loved the corn dogs you buy at carnivals but could not find a recipe for them. Great served with mustard. ",
      ingredients: `* 1 cup yellow cornmeal
        \n* 1 cup all-purpose flour
        \n* <sup>1</sup>/<sub>4</sub> teaspoon salt
        \n* <sup>1</sup>/<sub>8</sub> teaspoon black pepper
        \n* <sup>1</sup>/<sub>4</sub> cup white sugar
        \n* 4 teaspoons baking soda
        \n* 1 egg
        \n* 1 cup milk
        \n* 1 quart vegetable oil for frying
        \n* 2 (16 ounce) packages beef frankfurters
        \n* 16 wooden skewers`,
      directions: `### Step 1
        \nIn a medium bowl, combine cornmeal, flour, salt, pepper, sugar and baking powder. Stir in eggs and milk.
        \n### Step 2
        \nPreheat oil in a deep saucepan over medium heat. Insert wooden skewers into frankfurters. Roll frankfurters in batter until well coated.
        \n### Step 3
        \nFry 2 or 3 corn dogs at a time until lightly browned, about 3 minutes. Drain on paper towels.`,
      rtl: false,
      source: "sample source 1",
    },
    {
      id: "2",
      title: "עוגיות שוקולד צ'יפס",
      description:
        "מתכון לעוגיות שוקולד צ'יפס קלות להכנה והכי טעימות שיש! פשוט מערבבים את כל המצרכים, מסדרים ואופים. 10 דקות עבודה ועוד 15 דקות אפייה ויש לכם עוגיות מושלמות. ניתן להכין עם חמאה או שמן (לעוגיות חלביות או פרווה).",
      ingredients: `* 200 גר' חמאה מומסת / 160 מ"ל שמן (שני שליש כוס) לפרווה 
        \n* 2 כוסות קמח + 4 כפות
        \n* 1 כפית אבקת אפייה
        \n* 1/2 כפית סודה לשתייה 
        \n* 1 כוס שבבי שוקולד צ'יפס חלב / מריר / לבן
        \n* 3/4 כוס סוכר חום
        \n* 1/4 כוס סוכר לבן 
        \n* 2 ביצים m`,
      directions: `### שלב 1
        \nאת כל מצרכי העוגיות נלוש היטב בקערה עד לקבלת בצק עוגיות נוח.
        \n### שלב 2
        \nנרפד תבנית בנייר אפייה, ניצור מבצק העוגיות כדורים בגודל כדור פינג פינג ונסדר (עם רווחים) על התבנית.
        \n### שלב 3
        \n נאפה את העוגיות בתנור חם על 170 מעלות במשך כ רבע שעה, העוגיות מוכנות כשהן זהובות ויפות.`,
      rtl: true,
      source: "sample source2",
    },
    {
      id: "3",
      title: "Corn Dogs",
      description:
        "I made up this recipe many years ago, because I loved the corn dogs you buy at carnivals but could not find a recipe for them. Great served with mustard. ",
      ingredients: `* 1 cup yellow cornmeal
        \n* 1 cup all-purpose flour
        \n* <sup>1</sup>/<sub>4</sub> teaspoon salt
        \n* <sup>1</sup>/<sub>8</sub> teaspoon black pepper
        \n* <sup>1</sup>/<sub>4</sub> cup white sugar
        \n* 4 teaspoons baking soda
        \n* 1 egg
        \n* 1 cup milk
        \n* 1 quart vegetable oil for frying
        \n* 2 (16 ounce) packages beef frankfurters
        \n* 16 wooden skewers`,
      directions: `### Step 1
        \nIn a medium bowl, combine cornmeal, flour, salt, pepper, sugar and baking powder. Stir in eggs and milk.
        \n### Step 2
        \nPreheat oil in a deep saucepan over medium heat. Insert wooden skewers into frankfurters. Roll frankfurters in batter until well coated.
        \n### Step 3
        \nFry 2 or 3 corn dogs at a time until lightly browned, about 3 minutes. Drain on paper towels.`,
      rtl: false,
      source: "sample source 1",
    },
  ]);

  const [search, setSearch] = useState("");
  const onRecipeSearch = (text) => {
    setSearch(text);
  };

  const onEditRecipe = (recipeData) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === recipeData.id ? recipeData : recipe
      )
    );
  };

  return (
    <div>
      <Search onChange={onRecipeSearch} />
      <Button color="white" text={search} />

      {recipes.length > 0 ? (
        <Recipes recipes={recipes} onEditRecipe={onEditRecipe} />
      ) : (
        "No Recipes To Show"
      )}
    </div>
  );
}

export default App;
