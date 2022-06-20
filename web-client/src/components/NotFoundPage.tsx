import "../styles/NotFoundPage.css";
import PageTitle from "./utilities/PageTitle";

//mui
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

//mui icons
import CakeIcon from "@mui/icons-material/Cake";

//types
import { FC } from "react";

const NotFoundPage: FC = () => {
  return (
    <div className="page-not-found-page">
      <PageTitle marginTop={true} />
      <div className="body">
        <div className="message">
          Whoops, looks like you lost your way and landed here...
        </div>
        <div className="message">This Cake will show you the way back.</div>
        <Tooltip title="Click on me">
          <IconButton className="cake-button">
            <CakeIcon style={{ height: "20rem", width: "20rem" }} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default NotFoundPage;
