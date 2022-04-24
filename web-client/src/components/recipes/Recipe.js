import { useEffect } from "react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import "../../styles/recipes/Recipe.css";

import Favorite from "../Favorite";

import isURL from "validator/lib/isURL";

//mui
import Divider from "@mui/material/Divider";

//redux
import { useSelector } from "react-redux";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const Recipe = ({ recipe, image }) => {
  const signedIn = useSelector((state) => state.users.signedIn);

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
      <div
        className="recipe-header"
        style={{ textAlign: recipe.rtl ? "right" : "left" }}
      >
        <div className="recipe-title">
          {recipe.title}
          {signedIn && (
            <Favorite
              recipeId={recipe._id}
              favorited_by={recipe.favorited_by}
            />
          )}
        </div>
        <div
          className="recipe-description"
          id={recipe._id + "-recipe-description"}
        />
        <div>
          <div className="recipe-owner">
            <span>{recipe.rtl ? "העלה:" : "By:"}</span>{" "}
            <span style={{ fontSize: "120%" }}>
              {recipe.owner.firstname + " " + recipe.owner.lastname}
            </span>
          </div>
          <div className="recipe-time">
            <span>{recipe.rtl ? "עודכן:" : "Updated:"}</span>{" "}
            <span>
              {new Date(recipe.last_update_time).toLocaleString("he-IL", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="recipe-body">
        <div className="recipe-image-and-additional-data-container">
          {image && <img className="image" src={image} alt=""></img>}
          <div
            className="recipe-additional-data-container"
            style={{ direction: "ltr" }}
          >
            <span className="recipe-additional-data">
              <span className="additional-data-title">Category:</span>{" "}
              {recipe.category}
            </span>
            <span className="recipe-additional-data">
              <span className="additional-data-title">Sub Category:</span>{" "}
              {recipe.sub_category}
            </span>
            <span className="recipe-additional-data">
              <span className="additional-data-title">Difficulty:</span>{" "}
              {recipe.difficulty}
            </span>

            <span className="recipe-additional-data">
              <span className="additional-data-title">Prep Time:</span>{" "}
              {recipe.prep_time}
            </span>
            <span className="recipe-additional-data">
              <span className="additional-data-title">Total Time:</span>{" "}
              {recipe.total_time}
            </span>
            <span className="recipe-additional-data">
              <span className="additional-data-title">Servings:</span>{" "}
              <span dir={recipe.rtl ? "rtl" : "ltr"}>{recipe.servings}</span>
            </span>
          </div>
        </div>
        <div className="recipe-main-data-container">
          <div className="recipe-section">
            <div className="recipe-sub-title">
              {recipe.rtl ? "מרכיבים" : "Ingredients"}
            </div>
            <Divider style={{ backgroundColor: "gray" }} variant="fullWidth" />
            <div
              className="recipe-text-box"
              id={recipe._id + "-recipe-ingredients"}
            />
          </div>
          <div className="recipe-section">
            <div className="recipe-sub-title">
              {recipe.rtl ? "הוראות" : "Directions"}
            </div>
            <Divider style={{ backgroundColor: "gray" }} variant="fullWidth" />
            <div
              className="recipe-text-box"
              id={recipe._id + "-recipe-directions"}
            />
          </div>
        </div>
      </div>
      <div className="recipe-footer">
        {recipe.source && (
          <>
            <span className="recipe-footer-title">
              {recipe.rtl ? "מקור:" : "Source:"}
            </span>{" "}
            {isURL(recipe.source) ? (
              <a href={recipe.source}>{recipe.source}</a>
            ) : (
              <span>{recipe.source}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recipe;
