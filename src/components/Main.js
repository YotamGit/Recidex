import Recipes from "./Recipes";
import { useState } from "react";
//mui
import Pagination from "@mui/material/Pagination";

const Main = ({ recipes, getRecipes, onEditRecipe, deleteRecipe }) => {
  const [page, setpage] = useState(1);

  const changePage = (event, value) => {
    setpage(value);
    //here use the get recipes to get the recipes for the required page
  };
  return (
    <div>
      {recipes.length > 0 ? (
        <Recipes
          recipes={recipes}
          onEditRecipe={onEditRecipe}
          deleteRecipe={deleteRecipe}
        />
      ) : (
        "No Recipes To Show"
      )}
      <Pagination
        style={{ display: "flex", justifyContent: "center" }}
        count={10}
        color="primary"
        onChange={changePage}
      />
    </div>
  );
};

export default Main;
