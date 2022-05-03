import axios from "axios";
import { useState, useEffect } from "react";

//redux
import { useAppSelector } from "../../hooks";

const AdminKpis = () => {
  const users = useAppSelector((state) => state.recipes.recipes);
  const [recipeCount, setRecipeCount] = useState(0);

  useEffect(() => {
    const getRecipesCount = async () => {
      try {
        let count = await axios.get("/api/recipes/count");
        setRecipeCount(Number(count.data));
      } catch (error: any) {
        window.alert("Failed to get recipes count.\nReason: " + error.message);
      }
    };

    getRecipesCount();
  }, []);

  return (
    <div>
      <div>
        <div>Recipes</div>
        <div>{recipeCount}</div>
      </div>
    </div>
  );
};

export default AdminKpis;
