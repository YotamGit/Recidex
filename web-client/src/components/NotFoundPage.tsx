import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <PageTitle marginTop={true} />
      <div className="body">
        <div className="message">
          Whoops, looks like you lost your way and ended up here...
        </div>
        <div className="message">This Cake will show you the way back.</div>
        <Tooltip title="Click on me">
          <IconButton
            className="cake-button"
            onClick={() => navigate("/home", { replace: true })}
          >
            <CakeIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default NotFoundPage;
