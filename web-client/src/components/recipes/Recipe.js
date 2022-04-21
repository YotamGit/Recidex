import { useEffect } from "react";
import { marked } from "marked";
import "../../styles/recipes/Recipe.css";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

const Recipe = ({ recipe }) => {
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
    console.log(recipe);
  }, [recipe.description, recipe.ingredients, recipe.directions, recipe._id]);

  return (
    <div className="recipe" style={{ direction: recipe.rtl ? "rtl" : "ltr" }}>
      <div className="recipe-header">
        <div
          className="recipe-title"
          style={{ textAlign: recipe.rtl ? "right" : "left" }}
        >
          {recipe.title}
        </div>
        <div
          className="recipe-description"
          id={recipe._id + "-recipe-description"}
        />

        <span className="recipe-owner">
          By: {recipe.owner.firstname + " " + recipe.owner.lastname}
        </span>
      </div>
      <div className="recipe-body">
        <div className="recipe-image-and-additional-data-container">
          {recipe.image && (
            <img className="image" src={recipe.image} alt=""></img>
          )}
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
        <div className="recipe-main-data-container">
          <div className="recipe-section">
            <div>{recipe.rtl ? "מרכיבים" : "Ingredients"}</div>
            <div
              className="recipe-text-box"
              id={recipe._id + "-recipe-ingredients"}
            />
          </div>
          <div className="recipe-section">
            <div>{recipe.rtl ? "הוראות" : "Directions"}</div>
            <div
              className="recipe-text-box"
              id={recipe._id + "-recipe-directions"}
            />
          </div>
        </div>
      </div>
      <div className="recipe-footer">
        <span>source: {recipe.source}</span>
      </div>
    </div>
  );
};

export default Recipe;
