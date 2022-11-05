import { useState, useEffect } from "react";
import "../../styles/admin/AdminKpis.css";
import { getRecipeKpiData } from "../../utils-module/recipes";

import Kpi from "./Kpi";

// visualizations
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

//redux
import { useAppSelector } from "../../hooks";

ChartJS.register(ArcElement, Tooltip, Legend);

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

  const recipesPieData = {
    labels: ["Private", "Public", "Approval Required", "Approved"],
    datasets: [
      {
        data: [
          recipeKpiData?.private_recipes_count,
          recipeKpiData?.public_recipes_count,
          recipeKpiData?.approval_required_recipes_count,
          recipeKpiData?.approved_recipes_count,
        ],
        backgroundColor: [
          "rgba(255, 93, 85, 0.4)",
          "rgba(60, 89, 127, 0.4)",
          "rgba(242, 147, 57, 0.4)",
          "rgba(125, 221, 112, 0.4)",
        ],
        borderColor: [
          "rgba(255, 93, 85, 1)",
          "rgba(60, 89, 127, 1)",
          "rgba(242, 147, 57, 1)",
          "rgba(125, 221, 112, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="admin-kpis">
      <div className="kpis-container">
        <Kpi
          title={"Recipes"}
          body={recipeKpiData ? recipeKpiData.total_recipes_count : 0}
        />
        <span>
          <Doughnut data={recipesPieData} />
        </span>
      </div>
      <div className="kpis-container">
        <Kpi title={"Users"} body={users.length} />
        <span>
          <Doughnut data={recipesPieData} />
        </span>
      </div>
    </div>
  );
};

export default AdminKpis;
