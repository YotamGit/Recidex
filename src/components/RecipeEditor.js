import MarkdownEditor from "./MarkdownEditor";
import Button from "./Button.js";
import { useState } from "react";
import Popup from "reactjs-popup";

const RecipeEditor = () => {
  return (
    <div>
      <div>
        <div>description</div>
        <Popup trigger={<button>Edit</button>} modal nested>
          {(close) => (
            <>
              <button onClick={close}>&times;</button>
              <MarkdownEditor submitText="Save Description" />
            </>
          )}
        </Popup>
      </div>
      <div>
        <div>Ingredients</div>
        <Popup trigger={<button>Edit</button>} modal nested>
          {(close) => (
            <>
              <button onClick={close}>&times;</button>
              <MarkdownEditor submitText="Save Ingredients" />
            </>
          )}
        </Popup>
      </div>
      <div>
        <div>Directions</div>
        <Popup trigger={<button>Edit</button>} modal nested>
          {(close) => (
            <>
              <button onClick={close}>&times;</button>
              <MarkdownEditor submitText="Save Directions" />
            </>
          )}
        </Popup>
      </div>
    </div>
  );
};

export default RecipeEditor;
