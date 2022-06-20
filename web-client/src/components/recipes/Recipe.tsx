import { useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import "../../styles/recipes/Recipe.css";

import Favorite from "../buttons/Favorite";
import MarkdownPreviewSection from "../markdown/MarkdownPreviewSection";

import isURL from "validator/lib/isURL";

//types
import { TRecipe } from "../../slices/recipesSlice";
import { FC } from "react";

marked.setOptions({
  gfm: true,
  breaks: true,
  smartLists: true,
});

interface propTypes {
  recipe: TRecipe;
}
const Recipe: FC<propTypes> = ({ recipe }) => {
  const navigate = useNavigate();

  useEffect(() => {
    //activate checkboxes
    let textBoxes = document.getElementsByClassName("markdown-box");
    Array.from(textBoxes).map((textBox) =>
      (
        textBox.querySelectorAll(
          "input[type=checkbox]"
        ) as NodeListOf<HTMLInputElement>
      ).forEach((input) => (input.disabled = false))
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
          {!recipe.private && recipe._id && recipe.favorited_by && (
            <Favorite
              recipeId={recipe._id}
              favorited_by={recipe.favorited_by}
              style={{ direction: recipe.rtl ? "ltr" : "rtl" }}
              showCount={false}
            />
          )}
        </div>
        <div
          className="recipe-description"
          dangerouslySetInnerHTML={{
            __html: marked.parse(recipe.description ? recipe.description : ""),
          }}
        />
        <div>
          {recipe.owner && (
            <>
              <div
                className="recipe-owner"
                onClick={() => navigate(`/user/profile/${recipe.owner?._id}`)}
              >
                <span>{recipe.rtl ? "העלה: " : "By: "}</span>
                <span dir="auto" style={{ fontSize: "120%" }}>
                  {recipe.owner.firstname + " " + recipe.owner.lastname}
                </span>
              </div>
            </>
          )}

          <div className="recipe-time">
            <span>{recipe.rtl ? "עודכן: " : "Updated: "}</span>
            <span>
              {recipe.last_update_time &&
                new Date(recipe.last_update_time).toLocaleString("he-IL", {
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
          {recipe.imageName && (
            <img
              className="image"
              src={`/api/recipes/image/${recipe._id}?${Date.now()}`}
              alt=""
            />
          )}
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
              <span dir="auto">{recipe.servings}</span>
            </span>
          </div>
        </div>
        <div className="recipe-main-data-container">
          <MarkdownPreviewSection
            sectionTitle={recipe.rtl ? "מרכיבים" : "Ingredients"}
            markdownText={recipe.ingredients}
            rtl={recipe.rtl}
          />
          <MarkdownPreviewSection
            sectionTitle={recipe.rtl ? "הוראות" : "Directions"}
            markdownText={recipe.directions}
            rtl={recipe.rtl}
          />
          {recipe.notes && (
            <MarkdownPreviewSection
              sectionTitle={recipe.rtl ? "הערות" : "Notes"}
              markdownText={recipe.notes}
              rtl={recipe.rtl}
            />
          )}
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

export default memo(Recipe);
