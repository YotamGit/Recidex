import "../styles/PageTitle.css";

//redux
import { useAppSelector } from "../hooks";
//types
import { FC } from "react";

interface propTypes {
  style?: React.CSSProperties;
}
const PageTitle: FC<propTypes> = ({ style }) => {
  const currentPageTitle = useAppSelector(
    (state) => state.utilities.currentPageTitle
  );
  return (
    <div className="page-title" style={style ? style : {}}>
      <div className="title">{currentPageTitle}</div>
    </div>
  );
};

export default PageTitle;
