import { useState, useEffect } from "react";
import "../../styles/admin/AdminKpis.css";
import { getRecipeCount } from "../../utils-module/recipes";

import Kpi from "./Kpi";

//redux
import { useAppSelector } from "../../hooks";

const AdminKpis = () => {
  const users = useAppSelector((state) => state.users.users);
  const [recipeCount, setRecipeCount] = useState(0);

  useEffect(() => {
    getRecipeCount().then((res) => res && setRecipeCount(res));
  }, []);

  return (
    <div className="admin-kpis">
      <Kpi title={"Recipes"} body={recipeCount} />
      <Kpi title={"Users"} body={users.length} />
    </div>
  );
};

export default AdminKpis;
