import { useAppSelector } from "../../hooks";

const AdminKpis = () => {
  const recipes = useAppSelector((state) => state.recipes.recipes);
  const users = useAppSelector((state) => state.recipes.recipes);
  return <div>AdminKpis</div>;
};

export default AdminKpis;
