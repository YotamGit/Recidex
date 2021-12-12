import Button from "./components/Button";
import Search from "./components/Search";
import MarkdownEditor from "./components/MarkdownEditor";
import { useState } from "react";
import RecipeEditor from "./components/RecipeEditor";
import Recipe from "./components/Recipe";

function App() {
  const [search, setSearch] = useState("");
  const onRecipeSearch = (text) => {
    setSearch(text);
  };
  return (
    <div>
      <Search onChange={onRecipeSearch} />
      <Button color="white" text={search} />
      <Recipe />
    </div>
  );
}

export default App;
