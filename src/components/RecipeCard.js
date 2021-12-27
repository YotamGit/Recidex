import "../styles/RecipeCard.css";
import { Link } from "react-router-dom";
import Recipe from "./Recipe";
import { marked } from "marked";
import { useEffect } from "react";
import Button from "./Button";

//mui
import Chip from "@mui/material/Chip";

//icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const RecipeCard = ({ recipe, onEditRecipe, deleteRecipe }) => {
  useEffect(() => {
    document.getElementById(recipe.id + "-recipe-description").innerHTML =
      marked.parse(recipe.description ? recipe.description : "");
  }, [recipe.description, recipe.id]);

  return (
    <div className="recipe-card">
      <div className="recipe">
        <div className="recipe-header">
          <div className="recipe-card-top-button-row">
            <Link to={`/recipes/${recipe.id}`}>
              <OpenInFullRoundedIcon
                style={{ color: "gray", margin: "1%", fontSize: "3.5vh" }}
              />
            </Link>
            <DeleteForeverRoundedIcon
              style={{
                color: "red",
                margin: "1%",
                fontSize: "3.5vh",
                cursor: "pointer",
              }}
              onClick={() => deleteRecipe(recipe.id)}
            />
          </div>
          <div style={{ fontSize: "130%" }}>
            {recipe.title}
            <Link to={`/recipes/edit/${recipe.id}`}>
              <EditRoundedIcon
                style={{ color: "gray", marginLeft: "1%", fontSize: "3vh" }}
              />
            </Link>
          </div>
          <div style={{ fontSize: "60%" }}>source: {recipe.source}</div>
          <div className="recipe-additional-data-container">
            <Chip
              className="recipe-additional-data"
              label={"Category: " + recipe.category}
            />
            <Chip
              className="recipe-additional-data"
              label={"Difficulty: " + recipe.difficulty}
            />
            <Chip
              className="recipe-additional-data"
              label={"Duration: " + recipe.duration}
            />
          </div>
        </div>
        <div
          className="recipe-description-container"
          style={{ direction: recipe.rtl ? "rtl" : "ltr" }}
        >
          <div className="recipe-title">Description</div>
          <div
            className="recipe-text-box"
            id={recipe.id + "-recipe-description"}
          />
        </div>
        <div
          className="recipe-img"
          style={{ backgroundColor: "green", height: "60%", width: "100%" }}
        >
          IMAGE PLACEHOLDER
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
