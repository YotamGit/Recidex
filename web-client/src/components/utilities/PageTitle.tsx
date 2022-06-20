import "../../styles/utilities/PageTitle.css";

//redux
import { useAppSelector } from "../../hooks";
//types
import { FC } from "react";

interface propTypes {
  style?: React.CSSProperties;
  marginTop?: boolean;
}
const PageTitle: FC<propTypes> = ({ style, marginTop }) => {
  const currentPageTitle = useAppSelector(
    (state) => state.utilities.currentPageTitle
  );
  return (
    <div
      className="page-title"
      style={{
        ...(marginTop ? { marginTop: "1rem" } : {}),
        ...(style ? style : {}),
      }}
    >
      <div className="title">{currentPageTitle}</div>
    </div>
  );
};

export default PageTitle;
