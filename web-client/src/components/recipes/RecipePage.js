import Recipe from "./Recipe.js";
import "../../styles/recipes/RecipePage.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

//utils
import { getRecipe } from "../../utils-module/recipes.js";

//icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

//mui
import IconButton from "@mui/material/IconButton";

//redux
import { useSelector } from "react-redux";
const RecipePage = () => {
  const navigate = useNavigate();
  const { recipe_id } = useParams();
  const [recipe, setRecipe] = useState(
    useSelector(
      (state) =>
        state.recipes.recipes.filter((recipe) => recipe._id === recipe_id)[0]
    )
  );

  useEffect(() => {
    if (recipe === undefined) {
      getRecipe(recipe_id).then((res) => {
        setRecipe(res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {recipe && (
        <>
          <div className="recipe-page-top-button-row">
            <IconButton
              onClick={() => navigate(-1)}
              style={{ color: "gray", margin: "1%" }}
            >
              <CloseFullscreenRoundedIcon style={{ fontSize: "3.5vh" }} />
            </IconButton>

            <IconButton onClick={() => window.print()}>
              <LocalPrintshopIcon style={{ fontSize: "3.5vh" }} />
            </IconButton>
            <Link
              to={`/recipes/edit/${recipe._id}`}
              style={{ color: "gray", margin: "1%" }}
            >
              <EditRoundedIcon style={{ fontSize: "3.5vh" }} />
            </Link>
          </div>
          <div className="recipe-page">
            {recipe && <Recipe recipe={recipe} />}
          </div>
        </>
      )}
    </>
  );
};

export default RecipePage;
