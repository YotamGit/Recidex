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
import Tooltip from "@mui/material/Tooltip";

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
    window.scrollTo(0, 0);
    //fetch recipe if the page refeshes/loads from url
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
        <div className="recipe-page">
          <div className="recipe-page-top-button-row">
            <Tooltip title="Minimize recipe" arrow>
              <IconButton
                onClick={() => navigate(-1)}
                style={{ color: "gray" }}
              >
                <CloseFullscreenRoundedIcon className="icon" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print recipe" arrow>
              <IconButton onClick={() => window.print()}>
                <LocalPrintshopIcon className="icon" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit recipe" arrow>
              <IconButton
                onClick={() => navigate(`/recipes/edit/${recipe._id}`)}
                style={{ color: "gray" }}
              >
                <EditRoundedIcon className="icon" />
              </IconButton>
            </Tooltip>
          </div>
          {recipe && <Recipe recipe={recipe} />}
        </div>
      )}
    </>
  );
};

export default RecipePage;
