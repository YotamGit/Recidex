//types
import { PropTypes } from "@mui/material";
import { FC } from "react";

interface PropTypes {
  title: string;
  body: string | number;
}
const Kpi: FC<PropTypes> = () => {
  return <div>Kpi</div>;
};

export default Kpi;
