import { useState, useEffect } from "react";
import "../../styles/admin/AdminKpis.css";
import { getRecipeKpiData } from "../../utils-module/recipes";

import Kpi from "./Kpi";

//redux
import { useAppSelector } from "../../hooks";

interface RecipeKpiDataTypes {
  total_recipes_count: number;
  private_recipes_count: number;
  public_recipes_count: number;
  approval_required_recipes_count: number;
  approved_recipes_count: number;
}

const AdminKpis = () => {
  const users = useAppSelector((state) => state.users.users);
  const [recipeKpiData, setRecipeKpiData] = useState<RecipeKpiDataTypes>();

  useEffect(() => {
    getRecipeKpiData().then((res) => res && setRecipeKpiData(res));
  }, []);

  return (
    <div className="admin-kpis">
      <Kpi
        title={"Total Recipes"}
        body={recipeKpiData ? recipeKpiData.total_recipes_count : 0}
      />
      <Kpi
        title={"Private Recipes"}
        body={recipeKpiData ? recipeKpiData.private_recipes_count : 0}
      />
      <Kpi
        title={"Public Recipes"}
        body={recipeKpiData ? recipeKpiData.public_recipes_count : 0}
      />
      <Kpi
        title={"Public Recipes"}
        body={recipeKpiData ? recipeKpiData.approval_required_recipes_count : 0}
      />
      <Kpi
        title={"Public Recipes"}
        body={recipeKpiData ? recipeKpiData.approved_recipes_count : 0}
      />

      <Kpi title={"Users"} body={users.length} />
    </div>
  );
};

export default AdminKpis;
