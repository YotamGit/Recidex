import MarkdownEditor from "./MarkdownEditor";
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "../styles/RecipeEditor.css";
import { marked } from "marked";

const RecipeEditor = ({
  description,
  ingredients,
  directions,
  recipeTitle,
  rtl,
  setTitle,
  setDescription,
  setIngredients,
  setDirections,
  setRtl,
}) => {
  const [tempTitle, setTempTitle] = useState(recipeTitle);

  useEffect(() => {
    document.getElementById("recipe-editor-description").innerHTML =
      marked.parse(description);
    document.getElementById("recipe-editor-ingredients").innerHTML =
      marked.parse(ingredients);
    document.getElementById("recipe-editor-directions").innerHTML =
      marked.parse(directions);
  }, [description, ingredients, directions]);

  const onSubmitTitle = (close) => {
    if (!tempTitle) {
      alert("Please enter Title");
      return;
    } else {
      var res = window.confirm("Save?");
      if (res) {
        setTitle(tempTitle);
        close();
      }
    }
  };

  return (
    <div className="recipe-editor" style={{ direction: rtl ? "rtl" : "ltr" }}>
      <div className="recipe-editor-section checkbox">
        <label>Set Right To left</label>
        <input
          type="checkbox"
          checked={rtl}
          value={rtl}
          onChange={(e) => setRtl(e.currentTarget.checked)}
        />
      </div>
      <div className="recipe-editor-section">
        <h2>Title</h2>
        <div className="recipe-editor-text-box">{recipeTitle}</div>
        <Popup trigger={<button>Edit</button>} modal nested>
          {(close) => (
            <div className="recipe-editor-title-editor">
              <button onClick={close}>&times;</button>
              <div>
                <input
                  type="text"
                  onChange={(e) => setTempTitle(e.target.value)}
                  value={tempTitle}
                />

                <input
                  type="button"
                  value="Save Title"
                  onClick={() => onSubmitTitle(close)}
                ></input>
              </div>
            </div>
          )}
        </Popup>
      </div>
      <div className="recipe-editor-section">
        <h2>Description</h2>
        <div
          className="recipe-editor-text-box"
          id="recipe-editor-description"
        ></div>
        <Popup trigger={<button>Edit</button>} modal nested>
          {(close) => (
            <>
              <button onClick={close}>&times;</button>
              <MarkdownEditor
                contextText="Description"
                setData={setDescription}
                close={close}
                defaultText={description}
                setRtl={setRtl}
                defaultRtl={rtl}
              />
            </>
          )}
        </Popup>
      </div>
      <div className="recipe-editor-section">
        <h2>Ingredients</h2>
        <div
          className="recipe-editor-text-box"
          id="recipe-editor-ingredients"
        ></div>
        <Popup trigger={<button>Edit</button>} modal nested>
          {(close) => (
            <>
              <button onClick={close}>&times;</button>
              <MarkdownEditor
                contextText="Ingredients"
                setData={setIngredients}
                setRtl={setRtl}
                close={close}
                defaultText={ingredients}
                defaultRtl={rtl}
              />
            </>
          )}
        </Popup>
      </div>
      <div className="recipe-editor-section">
        <h2>Directions</h2>
        <div
          className="recipe-editor-text-box"
          id="recipe-editor-directions"
        ></div>
        <Popup trigger={<button>Edit</button>} modal nested>
          {(close) => (
            <>
              <button onClick={close}>&times;</button>
              <MarkdownEditor
                contextText="Directions"
                setData={setDirections}
                setRtl={setRtl}
                close={close}
                defaultText={directions}
                defaultRtl={rtl}
              />
            </>
          )}
        </Popup>
      </div>
    </div>
  );
};

export default RecipeEditor;
