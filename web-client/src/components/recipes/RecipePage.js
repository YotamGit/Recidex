import Recipe from "./Recipe.js";
import "../../styles/recipes/RecipePage.css";
import { Link, useNavigate, useParams } from "react-router-dom";

import IconButton from "@mui/material/IconButton";

//icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";

const RecipePage = ({ recipes }) => {
  const navigate = useNavigate();
  const { recipe_id } = useParams();
  const recipe = recipes.filter((recipe) => recipe._id === recipe_id)[0];

  return (
    <>
      <div className="recipe-page-top-button-row">
        <IconButton
          onClick={() => navigate(-1)}
          style={{ color: "gray", margin: "1%" }}
        >
          <CloseFullscreenRoundedIcon style={{ fontSize: "3.5vh" }} />
        </IconButton>
        <Link
          to={`/recipes/edit/${recipe._id}`}
          style={{ color: "gray", margin: "1%" }}
        >
          <EditRoundedIcon style={{ fontSize: "3.5vh" }} />
        </Link>
      </div>
      <div className="recipe-page">{recipe && <Recipe recipe={recipe} />}</div>
    </>
  );
};

export default RecipePage;
