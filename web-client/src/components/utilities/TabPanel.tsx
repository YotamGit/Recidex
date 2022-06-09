//types
import { FC } from "react";

interface propTypes {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const TabPanel: FC<propTypes> = ({ children, value, index }) => {
  return <>{value === index && children}</>;
};

export default TabPanel;
