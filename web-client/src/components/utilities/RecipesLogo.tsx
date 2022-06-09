import "../../styles/utilities/RecipesLogo.css";
import RecipesLogoImage from "../../utils-module/Photos/Recipes.svg";

import { useNavigate } from "react-router-dom";

//types
import { FC } from "react";

const RecipesLogo: FC = () => {
  const navigate = useNavigate();
  return (
    <img
      onClick={() => navigate("/home")}
      className="recipes-logo"
      src={RecipesLogoImage}
      alt=""
    ></img>
  );
};

export default RecipesLogo;
