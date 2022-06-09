import { useEffect } from "react";
//types
import { FC } from "react";

interface propTypes {
  func: Function;
  children: React.ReactElement;
}
const ComponentWrapper: FC<propTypes> = ({ func, children }) => {
  useEffect(() => {
    func();
  }, [func]);

  return children;
};

export default ComponentWrapper;
