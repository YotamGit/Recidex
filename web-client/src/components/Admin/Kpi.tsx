//types
import { PropTypes } from "@mui/material";
import { FC } from "react";

interface PropTypes {
  title: string;
  body: string | number;
}
const Kpi: FC<PropTypes> = ({ title, body }) => {
  return (
    <div>
      <div>{title}</div>
      <div>{body}</div>
    </div>
  );
};

export default Kpi;
