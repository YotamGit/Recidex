import MarkdownEditor from "./MarkdownEditor";
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "../styles/RecipeEditor.css";
import { marked } from "marked";

const RecipeEditor = ({ onEditRecipe, recipe }) => {
  const [tempTitle, setTempTitle] = useState(recipe.title);
  const [title, setTitle] = useState(tempTitle);
  const [tempSource, setTempSource] = useState(recipe.source);
  const [source, setSource] = useState(tempSource);

  const [description, setDescription] = useState(recipe.description);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [directions, setDirections] = useState(recipe.directions);
  const [rtl, setRtl] = useState(recipe.rtl);
  const id = recipe.id;

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
  const onSubmitSource = (close) => {
    var res = window.confirm("Save?");
    if (res) {
      setSource(tempSource);
      close();
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
      <div className="recipe-editor-section recipe-editor-metadata-section">
        <div className="recipe-editor-metadata">
          <h2>Title</h2>
          <div>{title}</div>
          <Popup trigger={<button>Edit</button>} modal nested>
            {(close) => (
              <div className="recipe-editor-metadata-editor">
                <button onClick={close}>&times;</button>
                <h2>Title</h2>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setTempTitle(e.target.value)}
                    value={tempTitle}
                    placeholder={title}
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
        <div className="recipe-editor-metadata">
          <h2>Source</h2>
          <div>{source}</div>
          <Popup trigger={<button>Edit</button>} modal nested>
            {(close) => (
              <div className="recipe-editor-metadata-editor">
                <button onClick={close}>&times;</button>
                <h2>Source</h2>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setTempSource(e.target.value)}
                    value={tempSource}
                    placeholder={source}
                  />

                  <input
                    type="button"
                    value="Save Source"
                    onClick={() => onSubmitSource(close)}
                  ></input>
                </div>
              </div>
            )}
          </Popup>
        </div>
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
      <button
        onClick={() => {
          onEditRecipe({
            id,
            title,
            source,
            rtl,
            description,
            ingredients,
            directions,
          });
        }}
      >
        Save Changes
      </button>
    </div>
  );
};

export default RecipeEditor;
