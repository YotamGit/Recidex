import { useEffect } from "react";
import { marked } from "marked";
import "../styles/Recipe.css";
import { Link } from "react-router-dom";

//icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const Recipe = ({ recipe, deleteRecipe }) => {
  useEffect(() => {
    document.getElementById(recipe.id + "-recipe-description").innerHTML =
      marked.parse(recipe.description ? recipe.description : "");
    document.getElementById(recipe.id + "-recipe-ingredients").innerHTML =
      marked.parse(recipe.ingredients ? recipe.ingredients : "");
    document.getElementById(recipe.id + "-recipe-directions").innerHTML =
      marked.parse(recipe.directions ? recipe.directions : "");
  }, [recipe.description, recipe.ingredients, recipe.directions, recipe.id]);

  return (
    <div className="recipe" style={{ direction: recipe.rtl ? "rtl" : "ltr" }}>
      <div className="recipe-header">
        <div className="recipe-page-top-button-row">
          <Link
            to={`/recipes/edit/${recipe.id}`}
            style={{ color: "gray", margin: "1%" }}
          >
            <EditRoundedIcon style={{ fontSize: "4vh" }} />
          </Link>
          <DeleteForeverRoundedIcon
            style={{
              color: "red",
              margin: "1%",
              fontSize: "4vh",
              cursor: "pointer",
            }}
            onClick={() => deleteRecipe(recipe.id)}
          />
        </div>
        <div style={{ fontSize: "130%" }}>{recipe.title}</div>
        <div style={{ fontSize: "80%" }}>source: {recipe.source}</div>
        <div className="recipe-additional-data-container">
          <span className="recipe-additional-data">
            Category: {recipe.category}
          </span>
          <span className="recipe-additional-data">
            Difficulty: {recipe.difficulty}
          </span>
          <span className="recipe-additional-data">
            Duration: {recipe.duration}
          </span>
        </div>
      </div>
      <div className="recipe-section recipe-description-container">
        <div className="recipe-title">Description</div>
        <div
          className="recipe-text-box"
          id={recipe.id + "-recipe-description"}
        />
      </div>
      <div className="recipe-section">
        <div className="recipe-title">Ingredients</div>
        <div
          className="recipe-text-box"
          id={recipe.id + "-recipe-ingredients"}
        />
      </div>
      <div className="recipe-section">
        <div className="recipe-title">Directions</div>
        <div
          className="recipe-text-box"
          id={recipe.id + "-recipe-directions"}
        />
      </div>
    </div>
  );
};

export default Recipe;
