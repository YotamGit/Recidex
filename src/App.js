import Button from "./components/Button";
import Search from "./components/Search";
import MarkdownEditor from "./components/MarkdownEditor";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const onRecipeSearch = (text) => {
    setSearch(text);
  };
  return (
    <div>
      <Search onChange={onRecipeSearch} />
      <Button color="white" text={search} />
      <MarkdownEditor submitText="Save Description" />
    </div>
  );
}

export default App;
