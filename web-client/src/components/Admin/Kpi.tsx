import "../../styles/admin/Kpi.css";

//types
import { FC } from "react";

interface propTypes {
  title: string;
  body: string | number;
}
const Kpi: FC<propTypes> = ({ title, body }) => {
  return (
    <div className="kpi">
      <div className="kpi-title">{title}</div>
      <div className="kpi-body">{body}</div>
    </div>
  );
};

export default Kpi;
