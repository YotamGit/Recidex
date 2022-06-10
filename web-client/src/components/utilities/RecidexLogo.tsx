import "../../styles/utilities/RecidexLogo.css";
import RecidexLogoImage from "../../utils-module/Photos/RecidexLogo.svg";

import { useNavigate } from "react-router-dom";

//types
import { FC } from "react";

const RecidexLogo: FC = () => {
  const navigate = useNavigate();
  return (
    <img
      onClick={() => navigate("/home")}
      className="recidex-logo"
      src={RecidexLogoImage}
      alt=""
    ></img>
  );
};

export default RecidexLogo;
