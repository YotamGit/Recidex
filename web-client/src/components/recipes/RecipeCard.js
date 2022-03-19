import "../../styles/recipes/RecipeCard.css";
import { Link, useNavigate } from "react-router-dom";
import { marked } from "marked";
import { useEffect } from "react";

//mui
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

//icons
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  useEffect(() => {
    document.getElementById(recipe._id + "-recipe-description").innerHTML =
      marked.parse(recipe.description ? recipe.description : "");
    if (recipe.image) {
      document.getElementById(recipe._id + "-recipe-card-image").src =
        recipe.image;
    }

    // resize description container if recipe has an image
    // document.getElementById(recipe._id + "-recipe-card-image")
    //   ? (document.getElementById(
    //       recipe._id + "-recipe-card-description-container"
    //     ).style.height = "20%")
    //   : (document.getElementById(
    //       recipe._id + "-recipe-card-description-container"
    //     ).style.height = "70%");
  }, [recipe._id, recipe.description, recipe.image]);

  return (
    <div className="recipe-card">
      <div className="recipe-card-top-button-row">
        <Link
          to={`/recipes/${recipe._id}`}
          style={{ color: "gray", margin: "1%" }}
        >
          <OpenInFullRoundedIcon style={{ fontSize: "3.5vh" }} />
        </Link>
        <Link
          to={`/recipes/edit/${recipe._id}`}
          style={{ color: "gray", margin: "1%" }}
        >
          <EditRoundedIcon style={{ fontSize: "3.5vh" }} />
        </Link>
      </div>
      <div
        className="recipe"
        onClick={() => navigate(`/recipes/${recipe._id}`)}
      >
        <div className="recipe-header">
          <div className="recipe-title">{recipe.title}</div>

          <div className="recipe-data-dates">
            <span className="recipe-data-date">
              {new Date(recipe.creation_time).toLocaleString("he-IL", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </span>

            <Divider orientation="vertical" variant="middle" />
            <span className="recipe-data-date">
              {new Date(recipe.last_update_time).toLocaleString("he-IL", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <Divider variant="middle" />
          <div className="recipe-data-chips">
            <Chip className="recipe-additional-data" label={recipe.category} />
            <Chip
              className="recipe-additional-data"
              label={recipe.sub_category}
            />
            <Chip
              className="recipe-additional-data"
              label={recipe.difficulty}
            />
          </div>
        </div>
        <div
          className="recipe-card-description-container"
          id={recipe._id + "-recipe-card-description-container"}
          style={{
            direction: recipe.rtl ? "rtl" : "ltr",
          }}
        >
          <div>
            <div
              className="recipe-text-box"
              id={recipe._id + "-recipe-description"}
            />
            <div>
              <div
                className="recipe-additional-data-field"
                label={"Servings: " + recipe.servings}
              />
              <div
                className="recipe-additional-data-field"
                label={"Source: " + recipe.source}
              />
              <div
                className="recipe-additional-data-field"
                label={"Prep Time: " + recipe.prep_time}
              />
              <div
                className="recipe-additional-data-field"
                label={"Total Time: " + recipe.total_time}
              />
              <div
                className="recipe-additional-data-field"
                label={"Author: "}
              />
            </div>
          </div>
        </div>
        {recipe.image && (
          <img
            className="recipe-card-image"
            id={recipe._id + "-recipe-card-image"}
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
