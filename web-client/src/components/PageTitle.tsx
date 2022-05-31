import "../styles/PageTitle.css";
import { useEffect } from "react";
//mui
import Divider from "@mui/material/Divider";
//redux
import { useAppSelector } from "../hooks";
//types
import { FC } from "react";

const PageTitle: FC = () => {
  const currentPageTitle = useAppSelector(
    (state) => state.utilities.currentPageTitle
  );
  return (
    <div className="page-title">
      <div className="title">{currentPageTitle}</div>
    </div>
  );
};

export default PageTitle;
