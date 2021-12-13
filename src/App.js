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
      ingredients:
        "* 1 cup yellow cornmeal\n* 1 cup all-purpose flour\n* <sup>1</sup>/<sub>4</sub> teaspoon salt\n* <sup>1</sup>/<sub>8</sub> teaspoon black pepper\n* <sup>1</sup>/<sub>4</sub> cup white sugar\n* 4 teaspoons baking soda\n* 1 egg\n* 1 cup milk\n* 1 quart vegetable oil for frying\n* 2 (16 ounce) packages beef frankfurters\n* 16 wooden skewers",
      directions:
        "### Step 1\nIn a medium bowl, combine cornmeal, flour, salt, pepper, sugar and baking powder. Stir in eggs and milk.\n### Step 2\nPreheat oil in a deep saucepan over medium heat. Insert wooden skewers into frankfurters. Roll frankfurters in batter until well coated.\n### Step 3\nFry 2 or 3 corn dogs at a time until lightly browned, about 3 minutes. Drain on paper towels.",
      rtl: false,
      source: "sample source 1",
    },
    {
      id: "2",
      title: "עוגיות שוקולד צ'יפס",
      description:
        "I made up this recipe many years ago, because I hated puppies you buy at carnivals but could not find a recipe for them. Great served with mustard. ",
      ingredients:
        "* 1 cup yellow puppy\n* 1 cup all-purpose flour\n* <sup>1</sup>/<sub>4</sub> teaspoon salt\n* <sup>1</sup>/<sub>8</sub> teaspoon black pepper\n* <sup>1</sup>/<sub>4</sub> cup white sugar\n* 4 teaspoons baking soda\n* 1 egg\n* 1 cup milk\n* 1 quart vegetable oil for frying\n* 2 (16 ounce) packages beef frankfurters\n* 16 wooden skewers",
      directions:
        "### Step 1\nIn a medium bowl, combine puppy, flour, salt, pepper, sugar and baking powder. Stir in eggs and milk.\n### Step 2\nPreheat oil in a deep saucepan over medium heat. Insert wooden skewers into frankfurters. Roll frankfurters in batter until well coated.\n### Step 3\nFry 2 or 3 corn dogs at a time until lightly browned, about 3 minutes. Drain on paper towels.",
      rtl: true,
      source: "sample source2",
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
