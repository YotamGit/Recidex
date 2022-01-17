import Recipe from "./Recipe.js";
import "../../styles/recipes/RecipePage.css";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";

//icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";

const RecipePage = ({ getRecipe }) => {
  const navigate = useNavigate();
  const { recipe_id } = useParams();
  const [recipe, setRecipe] = useState({});

  useEffect(() => {
    getRecipe(recipe_id)
      .then((result) => {
        setRecipe(result);
      })
      .catch((error) => window.alert(error));
  }, []);

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
