import MarkdownEditor from "./MarkdownEditor";
import Button from "./Button.js";
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "../styles/RecipeEditor.css";
import { marked } from "marked";

const RecipeEditor = ({
  description,
  ingredients,
  directions,
  setDescription,
  setIngredients,
  setDirections,
}) => {
  useEffect(() => {
    document.getElementById("recipe-editor-description").innerHTML =
      marked.parse(description);
    document.getElementById("recipe-editor-ingredients").innerHTML =
      marked.parse(ingredients);
    document.getElementById("recipe-editor-directions").innerHTML =
      marked.parse(directions);
  }, [description, ingredients, directions]);

  return (
    <div className="recipe-editor">
      <div>
        <div>description</div>
        <div
          className="recipe-editor-text-box"
          id="recipe-editor-description"
        ></div>
        <Popup trigger={<button>Edit</button>} modal nested>
          {(close) => (
            <>
              <button onClick={close}>&times;</button>
              <MarkdownEditor
                submitText="Save Description"
                setData={setDescription}
                close={close}
              />
            </>
          )}
        </Popup>
      </div>
      <div>
        <div>Ingredients</div>
        <div
          className="recipe-editor-text-box"
          id="recipe-editor-ingredients"
        ></div>
        <Popup trigger={<button>Edit</button>} modal nested>
          {(close) => (
            <>
              <button onClick={close}>&times;</button>
              <MarkdownEditor
                submitText="Save Ingredients"
                setData={setIngredients}
                close={close}
              />
            </>
          )}
        </Popup>
      </div>
      <div>
        <div>Directions</div>
        <div
          className="recipe-editor-text-box"
          id="recipe-editor-directions"
        ></div>
        <Popup trigger={<button>Edit</button>} modal nested>
          {(close) => (
            <>
              <button onClick={close}>&times;</button>
              <MarkdownEditor
                submitText="Save Directions"
                setData={setDirections}
                close={close}
              />
            </>
          )}
        </Popup>
      </div>
    </div>
  );
};

export default RecipeEditor;
