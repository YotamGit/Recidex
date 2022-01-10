import { useEffect } from "react";
import { marked } from "marked";
import "../../styles/recipes/Recipe.css";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";

//icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseFullscreenRoundedIcon from "@mui/icons-material/CloseFullscreenRounded";
marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const Recipe = ({ recipe, deleteRecipe }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById(recipe._id + "-recipe-description").innerHTML =
      marked.parse(recipe.description ? recipe.description : "");
    document.getElementById(recipe._id + "-recipe-ingredients").innerHTML =
      marked.parse(recipe.ingredients ? recipe.ingredients : "");
    document.getElementById(recipe._id + "-recipe-directions").innerHTML =
      marked.parse(recipe.directions ? recipe.directions : "");

    var textBoxes = document.getElementsByClassName("recipe-text-box");
    Array.from(textBoxes).map((textBox) =>
      textBox
        .querySelectorAll("input[type=checkbox]")
        .forEach((input) => (input.disabled = false))
    );
  }, [recipe.description, recipe.ingredients, recipe.directions, recipe._id]);

  return (
    <div className="recipe" style={{ direction: recipe.rtl ? "rtl" : "ltr" }}>
      <div className="recipe-header">
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
        <div style={{ fontSize: "130%" }}>{recipe.title}</div>
        <div style={{ fontSize: "80%" }}>source: {recipe.source}</div>
        <div className="recipe-additional-data-container">
          <span className="recipe-additional-data">
            Category: {recipe.category}
          </span>
          <span className="recipe-additional-data">
            Sub Category: {recipe.sub_category}
          </span>
          <span className="recipe-additional-data">
            Difficulty: {recipe.difficulty}
          </span>
          <span className="recipe-additional-data">
            Prep Time: {recipe.prep_time}
          </span>
          <span className="recipe-additional-data">
            Total Time: {recipe.total_time}
          </span>
          <span className="recipe-additional-data">
            Servings: {recipe.servings}
          </span>
        </div>
      </div>
      <div className="recipe-section recipe-description-container">
        <div className="recipe-title">
          {recipe.rtl ? "תיאור" : "Description"}
        </div>
        <div
          className="recipe-text-box"
          id={recipe._id + "-recipe-description"}
        />
      </div>
      <div className="recipe-section">
        <div className="recipe-title">
          {recipe.rtl ? "מרכיבים" : "Ingredients"}
        </div>
        <div
          className="recipe-text-box"
          id={recipe._id + "-recipe-ingredients"}
        />
      </div>
      <div className="recipe-section">
        <div className="recipe-title">
          {recipe.rtl ? "הוראות" : "Directions"}
        </div>
        <div
          className="recipe-text-box"
          id={recipe._id + "-recipe-directions"}
        />
      </div>
    </div>
  );
};

export default Recipe;
